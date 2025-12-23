//render.js

function Render() {
  this.tileContainer = document.querySelector('.tile-container');
  this.scoreContainer = document.querySelector('#score-val');
  this.bestScoreContainer = document.querySelector('#best-val');
  this.statusContainer = document.querySelector('#game-over-mask');
  this.menuContainer = document.querySelector('#start-menu');
  this.gridContainer = document.querySelector('.game-grid');
  
  this.containerWidth = 290; 
  this.gap = 8; 
}

Render.prototype.initGrid = function(size) {
  this.menuContainer.style.display = 'none';
  this.statusContainer.style.display = 'none';
  this.gridContainer.innerHTML = '';
  this.empty();

  this.cellSize = (this.containerWidth - (size + 1) * this.gap) / size;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-bg-cell';
      const pos = this.getPosition(r, c);
      cell.style.width = this.cellSize + 'px';
      cell.style.height = this.cellSize + 'px';
      cell.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      this.gridContainer.appendChild(cell);
    }
  }
};

Render.prototype.getPosition = function(row, col) {
  return {
    x: this.gap + col * (this.cellSize + this.gap),
    y: this.gap + row * (this.cellSize + this.gap)
  };
};

Render.prototype.render = function(grid, { score, status, bestScore }) {
  this.empty();
  this.renderScore(score);
  this.renderBestScore(bestScore);
  this.renderStatus(status);

  for (let row = 0; row < grid.size; row++) {
    for (let column = 0; column < grid.size; column++) {
      if (grid.cells[row][column]) {
        this.renderTile(grid.cells[row][column]);
      }
    }
  }
};

Render.prototype.renderTile = function(tile) {
  const tileInner = document.createElement('div');
  tileInner.setAttribute('class', 'tile-inner');
  tileInner.innerHTML = tile.value;

  if (this.cellSize < 50) tileInner.classList.add('tile-font-small');
  else if (this.cellSize < 60) tileInner.classList.add('tile-font-medium');
  else tileInner.classList.add('tile-font-large');

  const tileDom = document.createElement('div');
  let classList = ['tile', `tile-${tile.value}`];

  const pos = this.getPosition(tile.row, tile.column);

  // 设置基本大小
  tileDom.style.width = this.cellSize + 'px';
  tileDom.style.height = this.cellSize + 'px';

  // 动画时长（与 CSS pop/appear 协同）
  const moveDuration = 180; // ms
  const moveEasing = 'cubic-bezier(0.165, 0.84, 0.44, 1)';

  // 1) 正常移动（有 prePosition）
  if (tile.prePosition) {
    const prePos = this.getPosition(tile.prePosition.row, tile.prePosition.column);
    tileDom.style.transform = `translate(${prePos.x}px, ${prePos.y}px)`;
    tileDom.style.transition = 'none';
    tileDom.setAttribute('class', classList.join(' '));
    tileDom.appendChild(tileInner);
    this.tileContainer.appendChild(tileDom);

    // 强制回流
    // eslint-disable-next-line no-unused-expressions
    tileDom.offsetHeight;

    // 平滑移动到新位置
    tileDom.style.transition = `transform ${moveDuration}ms ${moveEasing}`;
    tileDom.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

  // 2) 合并动画（Manager 使用 mergedFrom）
  } else if (tile.mergedFrom) {
    // 先渲染并移动来源方块（平滑移动到目标并淡出，结束后从 DOM 删除）
    tile.mergedFrom.forEach(src => {
      const srcInner = document.createElement('div');
      srcInner.setAttribute('class', 'tile-inner');
      srcInner.innerHTML = src.value;

      if (this.cellSize < 50) srcInner.classList.add('tile-font-small');
      else if (this.cellSize < 60) srcInner.classList.add('tile-font-medium');
      else srcInner.classList.add('tile-font-large');

      const srcDom = document.createElement('div');
      srcDom.setAttribute('class', ['tile', `tile-${src.value}`].join(' '));
      srcDom.style.width = this.cellSize + 'px';
      srcDom.style.height = this.cellSize + 'px';

      const srcPre = src.prePosition ? this.getPosition(src.prePosition.row, src.prePosition.column) : this.getPosition(src.row, src.column);
      srcDom.style.transform = `translate(${srcPre.x}px, ${srcPre.y}px)`;
      srcDom.style.transition = 'none';
      srcDom.appendChild(srcInner);
      this.tileContainer.appendChild(srcDom);

      // 强制回流
      // eslint-disable-next-line no-unused-expressions
      srcDom.offsetHeight;

      // 平滑移动到合并目标并淡出
      srcDom.style.transition = `transform ${moveDuration}ms ${moveEasing}, opacity ${moveDuration}ms linear`;
      srcDom.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      srcDom.style.opacity = '0';

      // 在动画结束后清理 DOM，避免残留或覆盖
      setTimeout(() => {
        if (srcDom && srcDom.parentNode) srcDom.parentNode.removeChild(srcDom);
      }, moveDuration + 20);
    });

    // 立即附加并显示合并后的方块（不要延迟 append，避免被下一次 render 清空）
    classList.push('tile-merged');
    tileDom.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    tileDom.style.transition = 'none';
    tileDom.setAttribute('class', classList.join(' '));
    tileDom.appendChild(tileInner);
    this.tileContainer.appendChild(tileDom);

    // 强制回流以确保 CSS 的 pop 动画能正确触发
    // eslint-disable-next-line no-unused-expressions
    tileInner.offsetHeight;

  // 3) 新生成节点
  } else {
    classList.push('tile-new');
    tileDom.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    tileDom.setAttribute('class', classList.join(' '));
    tileDom.appendChild(tileInner);
    this.tileContainer.appendChild(tileDom);
  }
};

Render.prototype.renderScore = function(score) {
  this.scoreContainer.innerHTML = score;
};
Render.prototype.renderBestScore = function(bestScore) {
  this.bestScoreContainer.innerHTML = bestScore;
};

// Render.prototype.renderStatus = function(status) {
//   if (status === 'DOING') {
//     // 隐藏遮罩
//     this.statusContainer.style.display = 'none';
//   } else if (status === 'FAILURE') {
//     // 显示遮罩
//     this.statusContainer.style.display = 'flex';
//
//     const content = this.statusContainer.querySelector('.content');
//
//     content.textContent = 'SYSTEM FAILURE';
//     content.classList.remove('win');
//     content.classList.add('failure');
//
//   // if (status === 'FAILURE') {
//   //     content.textContent = 'SYSTEM FAILURE';
//   //     content.classList.remove('win');
//   //     content.classList.add('failure');
//   //
//   // }
//   }
//  };



Render.prototype.renderStatus = function(status) {
  const mask = this.statusContainer;
  const content = mask.querySelector('.content');

  if (status === 'DOING') {
    mask.style.display = 'none';
    return;
  }

  mask.style.display = 'flex';

  // ⭐ 每次先清空旧样式，防止串状态
  content.style.color = '';
  content.style.fontSize = '';
  content.style.fontWeight = '';
  content.style.textShadow = '';
  content.style.letterSpacing = '';

  if (status === 'FAILURE') {
    content.textContent = 'SYSTEM FAILURE';
    content.style.color = '#ff0055';
    content.style.fontSize = '32px';
    content.style.fontWeight = 'bold';
    content.style.textShadow = '0 0 10px #ff0055';
  }

  if (status === 'WIN') {
    content.textContent = 'YOU WIN';
    content.style.color = '#f9f002';
    content.style.fontSize = '40px';
    content.style.fontWeight = '800';
    content.style.textShadow = '0 0 20px #f9f002';
    content.style.letterSpacing = '2px';
    content.style.zIndex = '9999999';
  }
};


Render.prototype.empty = function() {
  this.tileContainer.innerHTML = '';
};