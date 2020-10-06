function Setup() {
  finished = false;
  openset = [];
  openset.push(start);
  //for (var i in start.neighbours) {
  //  openset.push(start.neighbours[i]);
  //}
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      openset.push(grid[i][j]);
    }
  }
  for (var i = 0; i < openset.length; i++) {
    openset[i].h = Infinity;
    openset[i].previus = undefined;
  }
  start.h = 0;
  setupComplete = true;
}
let setupComplete = false;
function DijkstraRun() {
  if (!cleared && !running) return;
  running = true;
  cleared = false;

  if (!setupComplete) Setup();
  if (openset.length > 0) {
    let current = openset[0];
    for (var i = 0; i < openset.length; i++) {
      if (openset[i].h < current.h) current = openset[i];
    }
    if (current === end) {
      t1 = performance.now();
      clearInterval(interval);
      finished = true;
      running = false;
      setupComplete = false;
      if (alerts) {
        alert(`Path found in: ${t1 - t0} ms`);
      }
    }
    RemoveElemnentArray(openset, current);
    closedset.push(current);

    for (var i = 0; i < current.neighbours.length; i++) {
      var neighbour = current.neighbours[i];
      if (!closedset.includes(neighbour) && !neighbour.wall) {
        var alt = current.h + heuristic(current, neighbour);
        if (alt < neighbour.h) {
          neighbour.h = alt;
          neighbour.previus = current;
        }
        //if (!openset.includes(neighbour)) openset.push(neighbour);
      }
    }

    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previus) {
      path.push(temp.previus);
      temp = temp.previus;
    }
    RenderGrid();
  } else {
    t1 = performance.now();
    clearInterval(interval);
    finished = true;
    running = false;
    setupComplete = false;
    if (alerts) {
      alert(`No solution found in: ${t1 - t0} ms`);
    }
  }
}
