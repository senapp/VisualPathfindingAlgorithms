function AstarRun() {
  if (!cleared && !running) return;
  running = true;
  cleared = false;
  if (openset.length > 0) {
    let current = openset[0];
    for (var i = 0; i < openset.length; i++) {
      if (openset[i].f < current.f) current = openset[i];
    }
    if (current === end) {
      t1 = performance.now();
      clearInterval(interval);
      finished = true;
      running = false;
      if (alerts) {
        alert(`Path found in: ${t1 - t0} ms`);
      }
    }
    RemoveElemnentArray(openset, current);
    closedset.push(current);

    for (var i = 0; i < current.neighbours.length; i++) {
      var neighbour = current.neighbours[i];
      if (!closedset.includes(neighbour) && !neighbour.wall) {
        var tempG = current.g + 1;

        if (openset.includes(neighbour)) {
          if (tempG < neighbour.g) {
            neighbour.g = tempG;
            neighbour.h = heuristic(neighbour, end);
            neighbour.f = neighbour.g + neighbour.h;
            neighbour.previus = current;
          }
        } else {
          neighbour.g = tempG;
          openset.push(neighbour);
          neighbour.h = heuristic(neighbour, end);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previus = current;
        }
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
    if (alerts) {
      alert(`No solution found in: ${t1 - t0} ms`);
    }
  }
}
