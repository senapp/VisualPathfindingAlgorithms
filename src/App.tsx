import * as React from 'react';
import { Grid } from './control/Grid';
import { CanvasView } from './components/CanvasView';
import { SettingsView } from './components/SettingsView';
import { AstarRun, BFSRun, DijkstraRun } from './control/Algorithm';
import { useReducer, useRef } from 'react';
import { AlgorithmMode } from './utils/types';
import css from './App.module.css';

export const App: React.FC = () => {
    const interval = useRef<NodeJS.Timer | undefined>(undefined);
    const grid = useRef<Grid>(new Grid());

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const onRun = (): void => {
        switch (grid.current.state.algorithm) {
            case AlgorithmMode.Astar:
                AstarRun(grid.current, onFinish);
                break;
            case AlgorithmMode.Dijkstra:
                DijkstraRun(grid.current, onFinish);
                break;
            case AlgorithmMode.BFS:
                BFSRun(grid.current, onFinish);
                break;
        }
    };

    const onFinish = (): void => {
        if (interval.current) {
            clearInterval(interval.current);
            forceUpdate();
        }
    };

    const onBegin = (): void => {
        if (grid.current.state.finished) {
            grid.current.resetGrid(false);
        }

        if (grid.current.state.ready) {
            grid.current.state = ({ ...grid.current.state, t0: performance.now(), running: true });
            interval.current = setInterval(() => onRun(), 0);
        } else {
            alert('Please create the grid');
        }
    };

    return (
        <div className={css.container}>
            <CanvasView />
            <SettingsView grid={grid.current} onBegin={onBegin} />
        </div>
    );
};