function RenderGrid() {
  if (renderMode < 3) {
    if (renderMode == 2) ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if (renderMode != 2) {
          if (openset.includes(grid[i][j])) grid[i][j].show("green");
          else if (closedset.includes(grid[i][j]))
            grid[i][j].show("red", renderMode);
          if (path.includes(grid[i][j])) grid[i][j].show("blue");
        } else {
          if (grid[i][j].wall) grid[i][j].show("black");
        }
      }
    }

    if (renderMode == 2) {
      ctx.beginPath();
      for (var i = 0; i < path.length; i++) {
        ctx.lineTo(path[i].i * w + w / 2, path[i].j * h + h / 2);
        ctx.moveTo(path[i].i * w + w / 2, path[i].j * h + h / 2);
      }
      ctx.strokeStyle = "blue";
      ctx.lineWidth = (w + h) / 4;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    start.show("yellow");
    end.show("yellow");
  }
}
