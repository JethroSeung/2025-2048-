// scripts/tile.js

function Tile(position, value) {
  // 兼容 x/y 和 row/column
  this.row = position.row !== undefined ? position.row : position.x;
  this.column = position.column !== undefined ? position.column : position.y;
  this.value = value;

  this.prePosition = null;
  this.mergedFrom = null; // 统一使用 mergedFrom
}

Tile.prototype.savePosition = function() {
  this.prePosition = { row: this.row, column: this.column };
};

Tile.prototype.updatePosition = function(position) {
  // 1. 兼容 Manager 传过来的 {x, y} 格式
  let newRow = position.row !== undefined ? position.row : position.x;
  let newCol = position.column !== undefined ? position.column : position.y;

  this.row = newRow;
  this.column = newCol;
};

Tile.prototype.serialize = function() {
  return {
    position: {
      row: this.row,
      column: this.column
    },
    value: this.value
  };
};