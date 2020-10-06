let w, h;
let start;
let end;
let grid = [];
let openset = [];
let closedset = [];
let path = [];
let cols, rows;
let cleared = true;
function CreateGrid(_cols, _rows) {
  grid = [];
  openset = [];
  closedset = [];
  cols = _cols;
  rows = _rows;
  grid = new Array(cols);
  cleared = true;

  w = width / cols;
  h = height / rows;

  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
      grid[i][j].show();
    }
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }
  start = grid[0][0];
  start.wall = false;
  start.show("yellow");
  end = grid[cols - 1][rows - 1];
  end.wall = false;
  end.show("yellow");

  openset.push(start);
}
function ClearGrid(keepPath) {
  if (!keepPath) {
    cleared = true;
    openset = [];
    openset.push(start);
    closedset = [];
    path = [];
    RecalculateCells();
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
  start.wall = false;
  end.wall = false;
  RenderGrid();
  start.show("yellow");
  end.show("yellow");
}
function RecalculateCells() {
  if (cols < 1) return;
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].neighbours = [];
      grid[i][j].f = 0;
      grid[i][j].g = 0;
      grid[i][j].h = 0;
      grid[i][j].previus = undefined;
      grid[i][j].addNeighbours(grid);
    }
  }
}
