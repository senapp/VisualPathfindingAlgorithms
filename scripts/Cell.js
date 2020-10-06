function Cell(i, j) {
  this.f = 0;
  this.g = 0;
  this.h = 0;

  this.i = i;
  this.j = j;

  this.previus = undefined;
  this.neighbours = [];
  this.wall = false;

  if (Math.random(1) < wallModifier) {
    this.wall = true;
  }
  this.show = function (fill = "white") {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    if (renderMode == 0) ctx.rect(i * w, j * h, w - 1, h - 1);
    else if (renderMode == 1)
      ctx.arc(i * w + w / 2, j * h + h / 2, (w + h) / 4, 0, Math.PI * 2);
    else if (renderMode == 2 && this.wall)
      ctx.arc(i * w + w / 2, j * h + h / 2, (w + h) / 8, 0, Math.PI * 2);
    if ((fill && renderMode != 2) || this.wall) {
      ctx.fillStyle = fill;
      if (this.wall) ctx.fillStyle = "black";
      ctx.fill();
    }
    ctx.stroke();
  };
  this.addNeighbours = function (grid) {
    if (this.i < cols - 1) {
      this.neighbours.push(grid[this.i + 1][this.j]);
    }
    if (this.i > 0) {
      this.neighbours.push(grid[this.i - 1][this.j]);
    }
    if (this.j < rows - 1) {
      this.neighbours.push(grid[this.i][this.j + 1]);
    }
    if (this.j > 0) {
      this.neighbours.push(grid[this.i][this.j - 1]);
    }
    if (diagonals) {
      if (this.j > 0 && this.i > 0) {
        this.neighbours.push(grid[this.i - 1][this.j - 1]);
      }
      if (this.j > 0 && this.i < cols - 1) {
        this.neighbours.push(grid[this.i + 1][this.j - 1]);
      }
      if (this.j < rows - 1 && this.i > 0) {
        this.neighbours.push(grid[this.i - 1][this.j + 1]);
      }
      if (this.j < rows - 1 && this.i < cols - 1) {
        this.neighbours.push(grid[this.i + 1][this.j + 1]);
      }
    }
  };
}
