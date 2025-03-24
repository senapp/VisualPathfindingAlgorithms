import { Grid } from './Grid';
import { heuristic, removeElementArray } from '../utils/funcs';
import { RenderGrid } from './Rendering';

export const AstarRun = (grid: Grid, onFinish: () => void): void => {
    if (!grid.state.cleared && !grid.state.running) {
        return;
    }

    if (grid.openset.length > 0) {
        let [current] = grid.openset;
        for (let i = 0; i < grid.openset.length; i++) {
            if (grid.openset[i].f < current.f) {
                current = grid.openset[i];
            }
        }

        let ending = false;
        if (current === grid.end) {
            grid.state.t1 = performance.now();
            grid.state.finished = true;
            grid.state.running = false;
            grid.state.success = true;
            if (grid.state.alerts) {
                alert(`Path found in: ${grid.state.t1 - grid.state.t0} ms`);
            }

            ending = true;
        }

        if (!ending) {
            removeElementArray(grid.openset, current);
            grid.closedset.push(current);
            for (let i = 0; i < current.neighbours.length; i++) {
                const neighbour = current.neighbours[i];
                if (neighbour && !grid.closedset.includes(neighbour) && !neighbour.wall) {
                    const tempG = current.g + 1;
    
                    if (grid.openset.includes(neighbour)) {
                        if (tempG < neighbour.g) {
                            neighbour.g = tempG;
                            neighbour.h = heuristic(neighbour, grid.end, grid.state.heuristicAlgorithm);
                            neighbour.f = neighbour.g + neighbour.h;
                            neighbour.previous = current;
                        }
                    } else {
                        neighbour.g = tempG;
                        grid.openset.push(neighbour);
                        neighbour.h = heuristic(neighbour, grid.end, grid.state.heuristicAlgorithm);
                        neighbour.f = neighbour.g + neighbour.h;
                        neighbour.previous = current;
                    }
                }
            }
        }

        grid.path = [];
        let temp = current;
        grid.path.push(temp);
        while (temp.previous) {
            grid.path.push(temp.previous);
            temp = temp.previous;
        }

        if (ending) {
            onFinish();
        }

    } else {
        grid.state.t1 = performance.now();
        grid.state.finished = true;
        grid.state.running = false;
        grid.state.success = false;
        if (grid.state.alerts) {
            alert(`No solution found in: ${grid.state.t1 - grid.state.t0} ms`);
        }

        onFinish();
    }

    RenderGrid(grid);
};

export const DijkstraRun = (grid: Grid, onFinish: () => void): void => {
    if (!grid.state.cleared && !grid.state.running) {
        return;
    }

    if (!grid.state.customInit) {
        grid.state.customInit = true;
        for (let x = 0; x < grid.cols; x++) {
            for (let y = 0; y < grid.rows; y++) {
                grid.cells[x][y].g = Infinity;
                grid.cells[x][y].previous = undefined;
                if (grid.cells[x][y] != grid.openset[0] && !grid.cells[x][y].wall) {
                    grid.openset.push(grid.cells[x][y]);
                }
            }
        }
        grid.start.g = 0;
    }

    if (grid.openset.length > 0) {
        let minDistance = Infinity;
        let minIndex = Infinity;
        grid.openset.forEach((cell, index) => {
            if (cell.g <= minDistance) {
                minIndex = index;
                minDistance = cell.g;
            }
        });

        let current = grid.openset[minIndex];

        let ending = false;
        if (current === grid.end && current.previous !== undefined) {
            grid.state.t1 = performance.now();
            grid.state.finished = true;
            grid.state.running = false;
            grid.state.success = true;
            if (grid.state.alerts) {
                alert(`Path found in: ${grid.state.t1 - grid.state.t0} ms`);
            }

            ending = true;
        }

        if (!ending) {
            removeElementArray(grid.openset, current);
            grid.closedset.push(current);

            for (let i = 0; i < current.neighbours.length; i++) {
                const neighbour = current.neighbours[i];
                if (neighbour && !neighbour.wall && grid.openset.includes(neighbour)) {
                    let alt = current.g + 1;
                    if (alt < neighbour.g) {
                        neighbour.g = alt;
                        neighbour.previous = current;
                    }
                }
            }
        }

        grid.path = [];
        let temp = current;
        grid.path.push(temp);
        while (temp.previous) {
            grid.path.push(temp.previous);
            temp = temp.previous;
        }

        if (ending) {
            onFinish();
        }
    } else {
        grid.state.t1 = performance.now();
        grid.state.finished = true;
        grid.state.running = false;
        grid.state.success = false;
        if (grid.state.alerts) {
            alert(`No solution found in: ${grid.state.t1 - grid.state.t0} ms`);
        }

        onFinish();
    }

    RenderGrid(grid);
};

export const BFSRun = (grid: Grid, onFinish: () => void): void => {
    if (!grid.state.cleared && !grid.state.running) {
        return;
    }

    if (!grid.state.customInit) {
        grid.state.customInit = true;
        grid.openset.push(grid.start);
    }

    if (grid.openset.length > 0) {
        let current = grid.openset.shift();
        if (current) {

            let ending = false;
            if (current === grid.end) {
                grid.state.t1 = performance.now();
                grid.state.finished = true;
                grid.state.running = false;
                grid.state.success = true;
                if (grid.state.alerts) {
                    alert(`Path found in: ${grid.state.t1 - grid.state.t0} ms`);
                }
    
                ending = true;
            }
    
            if (!ending) {
                grid.closedset.push(current);
                for (let i = 0; i < current.neighbours.length; i++) {
                    const neighbour = current.neighbours[i];
                    if (neighbour && !grid.closedset.includes(neighbour) && !neighbour.wall && !grid.openset.includes(neighbour)) {
                        neighbour.previous = current;
                        grid.openset.push(neighbour);
                    }
                }
            }
    
            grid.path = [];
            let temp = current;
            grid.path.push(temp);
            while (temp.previous) {
                grid.path.push(temp.previous);
                temp = temp.previous;
            }
    
            if (ending) {
                onFinish();
            }
        }
    } else {
        grid.state.t1 = performance.now();
        grid.state.finished = true;
        grid.state.running = false;
        grid.state.success = false;
        if (grid.state.alerts) {
            alert(`No solution found in: ${grid.state.t1 - grid.state.t0} ms`);
        }

        onFinish();
    }

    RenderGrid(grid);
};