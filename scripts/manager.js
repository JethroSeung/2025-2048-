// scripts/manager.js

function Manager() {
  this.render = new Render();
  this.storage = new Storage();
  this.history = [];

  this.bindMenuEvents();
  
  let self = this;
  this.listener = new Listener({
    move: function(direction) { self.listenerFn(direction); },
    start: function() { self.showMenu(); }
  });
  
  // 绑定撤销
  const btnB = document.getElementById('btn-b');
  if(btnB) {
    btnB.addEventListener('click', () => self.undo());
    btnB.addEventListener('touchstart', (e) => { e.preventDefault(); self.undo(); }, {passive: false});
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'b' || e.key === 'B') self.undo();
  });

  this.showMenu();
}

Manager.prototype.bindMenuEvents = function() {
  const options = document.querySelectorAll('.menu-opt');
  const self = this;
  Array.from(options).forEach(btn => {
    btn.addEventListener('click', function() {
      const size = parseInt(this.getAttribute('data-size'), 10);
      if (size >= 4 && size <= 6) {
        self.start(size);
      }
    });
  });
};

Manager.prototype.showMenu = function() {
  document.getElementById('start-menu').style.display = 'flex';
  this.status = 'MENU';
};

Manager.prototype.start = function(size) {
  this.size = size;
  this.render.initGrid(this.size);
  
  this.score = 0;
  this.status = 'DOING';
  this.grid = new Grid(this.size);
  this.history = [];

  this.addRandomTile();
  this.addRandomTile();
  
  this.actuate();
};

Manager.prototype.undo = function() {
  if (this.status !== 'DOING') return;
  if (this.history.length > 0) {
    const lastState = this.history.pop();
    this.grid = new Grid(lastState.size, lastState.grid);
    this.score = lastState.score;
    this.actuate();
  }
};

Manager.prototype.addRandomTile = function() {
  if (this.grid.cellsAvailable()) {
    const value = Math.random() < 0.9 ? 2 : 4;
    const position = this.grid.randomAvailableCell();
    this.grid.add(new Tile(position, value));
  }
};

Manager.prototype.actuate = function() {
  let bestScore = this.storage.getBestScore() || 0;
  if (this.score > bestScore) {
    bestScore = this.score;
    this.storage.setBestScore(bestScore);
  }

  this.render.render(this.grid, {
    score: this.score,
    status: this.status,
    bestScore: bestScore
  });
};

Manager.prototype.listenerFn = function(direction) {
  if (this.status !== 'DOING') return;

  const vector = this.getVector(direction);
  const traversals = this.buildTraversals(vector);
  let moved = false;

  const preState = {
    grid: this.grid.serialize(),
    score: this.score,
    size: this.size
  };

  this.prepareTiles();

  let self = this;
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      let cell = { x: x, y: y };
      let tile = self.grid.cellContent(cell);

      if (tile) {
        let positions = self.findFarthestPosition(cell, vector);
        let next = self.grid.cellContent(positions.next);

        // === 核心逻辑修改开始 ===
        if (next && next.value === tile.value && !next.mergedFrom) {
          let merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          // 1. 先把当前移动的方块从老位置删掉
          self.grid.removeTile(tile);

          // 2. 直接插入新方块（这将自动覆盖掉 positions.next 上的 'next' 方块）
          // 之前的问题是先 insert 再 remove next，导致把刚 insert 的也删了
          self.grid.insertTile(merged);

          // 3. 更新位置信息以便渲染动画
          tile.updatePosition(positions.next);

          self.score += merged.value;
        } else {
          // 普通移动
          self.moveTile(tile, positions.farthest);
        }
        // === 核心逻辑修改结束 ===

        if (!self.positionsEqual(cell, tile)) {
          moved = true;
        }
      }
    });
  });

  if (moved) {
    if (this.history.length > 10) this.history.shift();
    this.history.push(preState);
    this.addRandomTile();
    if (!this.movesAvailable()) {
      this.status = 'FAILURE';
    }
    this.actuate();
  }
};

Manager.prototype.getVector = function(direction) {
  return { x: direction.row, y: direction.column };
};

Manager.prototype.buildTraversals = function(vector) {
  let traversals = { x: [], y: [] };
  for (let pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();
  return traversals;
};

Manager.prototype.findFarthestPosition = function(cell, vector) {
  let previous;
  do {
    previous = cell;
    cell = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));
  return { farthest: previous, next: cell };
};

Manager.prototype.movesAvailable = function() {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

Manager.prototype.tileMatchesAvailable = function() {
  let self = this;
  let tile;
  for (let x = 0; x < this.size; x++) {
    for (let y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });
      if (tile) {
        for (let direction = 0; direction < 4; direction++) {
          let vector = self.getVector({
             row: (direction === 0 ? -1 : (direction === 2 ? 1 : 0)),
             column: (direction === 3 ? -1 : (direction === 1 ? 1 : 0))
          });
          let cell = { x: x + vector.x, y: y + vector.y };
          let other = self.grid.cellContent(cell);
          if (other && other.value === tile.value) return true;
        }
      }
    }
  }
  return false;
};

Manager.prototype.prepareTiles = function() {
  this.grid.eachCell(function(x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      if(tile.savePosition) tile.savePosition();
    }
  });
};

Manager.prototype.moveTile = function(tile, cell) {
  this.grid.cells[tile.row][tile.column] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

Manager.prototype.positionsEqual = function(first, second) {
  return first.x === second.x && first.y === second.y;
};