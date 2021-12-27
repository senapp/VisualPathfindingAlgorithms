import { AppState } from '../App';
import { Grid } from './Grid';
import { heuristic, removeElemnentArray as RemoveElementArray } from '../utils/funcs';
import { RenderGrid } from './Rendering';

export enum AlgorithmMode {
    Astar = 0,
    Dijkstra = 1
}

export const AstarRun = (grid: Grid, appState: AppState, onFinish: () => void): void => {
    if (!grid.state.cleared && !grid.state.running) {
        return;
    }

    grid.state.running = true;
    grid.state.cleared = false;

    if (grid.openset.length > 0) {
        let [current] = grid.openset;
        for (let i = 0; i < grid.openset.length; i++) {
            if (grid.openset[i].f < current.f) {
                current = grid.openset[i];
            }
        }
        if (current === grid.end) {
            grid.state.t1 = performance.now();
            grid.state.finished = true;
            grid.state.running = false;
            if (appState.alerts) {
                alert(`Path found in: ${grid.state.t1 - grid.state.t0} ms`);
            }

            onFinish();
        }

        RemoveElementArray(grid.openset, current);
        grid.closedset.push(current);

        for (let i = 0; i < current.neighbours.length; i++) {
            const neighbour = current.neighbours[i];
            if (neighbour && !grid.closedset.includes(neighbour) && !neighbour.wall) {
                const tempG = current.g + 1;

                if (grid.openset.includes(neighbour)) {
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG;
                        neighbour.h = heuristic(neighbour, grid.end);
                        neighbour.f = neighbour.g + neighbour.h;
                        neighbour.previous = current;
                    }
                } else {
                    neighbour.g = tempG;
                    grid.openset.push(neighbour);
                    neighbour.h = heuristic(neighbour, grid.end);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.previous = current;
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
    } else {
        grid.state.t1 = performance.now();
        grid.state.finished = true;
        grid.state.running = false;

        if (appState.alerts) {
            alert(`No solution found in: ${grid.state.t1 - grid.state.t0} ms`);
        }

        onFinish();
    }

    RenderGrid(grid, appState.renderMode);
};