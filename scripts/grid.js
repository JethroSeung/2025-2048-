// scripts/grid.js

function Grid(size = 4, state) {
  this.size = size;
  this.cells = [];
  this.init(size);
  // 如果有之前的进度，则恢复
  if (state) {
    this.recover(state);
  }
}

Grid.prototype.init = function(size) {
  for (let row = 0; row < size; row++) {
    this.cells.push([]);
    for (let column = 0; column < size; column++) {
      this.cells[row].push(null);
    }
  }
};

Grid.prototype.recover = function({ size, cells }) {
  this.size = size;
  for (let row = 0; row < this.size; row++) {
    for (let column = 0; column < this.size; column++) {
      const cell = cells[row][column];
      if (cell) {
        this.cells[row][column] = new Tile(cell.position, cell.value);
      }
    }
  }
};

// === 以下是 Manager.js 需要调用的关键补充方法 ===

// 遍历所有格子
Grid.prototype.eachCell = function(callback) {
  for (let row = 0; row < this.size; row++) {
    for (let column = 0; column < this.size; column++) {
      // Manager 使用 x/y 逻辑，对应这里的 row/column
      callback(row, column, this.cells[row][column]);
    }
  }
};

// 检查是否有空格子
Grid.prototype.cellsAvailable = function() {
  return !!this.availableCells().length;
};

// 检查特定格子是否为空
Grid.prototype.cellAvailable = function(cell) {
  return !this.cellContent(cell);
};

// 获取特定格子的内容
Grid.prototype.cellContent = function(cell) {
  if (this.withinBounds(cell)) {
    // 兼容 {x, y} 和 {row, column}
    let r = (cell.x !== undefined) ? cell.x : cell.row;
    let c = (cell.y !== undefined) ? cell.y : cell.column;
    return this.cells[r][c];
  } else {
    return null;
  }
};

// 插入方块 (别名 add)
Grid.prototype.insertTile = function(tile) {
  this.cells[tile.row][tile.column] = tile;
};

Grid.prototype.add = function(tile) {
  this.insertTile(tile);
};

// 移除方块 (别名 remove)
Grid.prototype.removeTile = function(tile) {
  this.cells[tile.row][tile.column] = null;
};

Grid.prototype.remove = function(tile) {
  this.removeTile(tile);
};

// 检查位置是否在界内
Grid.prototype.withinBounds = function(position) {
  let r = (position.x !== undefined) ? position.x : position.row;
  let c = (position.y !== undefined) ? position.y : position.column;
  return r >= 0 && r < this.size && c >= 0 && c < this.size;
};

// 获取所有可用位置
Grid.prototype.availableCells = function() {
  const cells = [];
  this.eachCell(function(x, y, tile) {
    if (!tile) {
      // 返回 Manager 喜欢的 x/y 格式，同时也保留 row/column
      cells.push({ x: x, y: y, row: x, column: y });
    }
  });
  return cells;
};

Grid.prototype.randomAvailableCell = function() {
  const cells = this.availableCells();
  if (cells.length > 0) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.serialize = function() {
  const cellState = [];
  for (let row = 0; row < this.size; row++) {
    cellState[row] = [];
    for (let column = 0; column < this.size; column++) {
      cellState[row].push(
        this.cells[row][column] ? this.cells[row][column].serialize() : null
      );
    }
  }
  return {
    size: this.size,
    cells: cellState
  };
};