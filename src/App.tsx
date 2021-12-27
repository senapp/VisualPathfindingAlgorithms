import * as React from 'react';
import { Grid } from './control/Grid';
import { CanvasView } from './components/CanvasView';
import { SettingsView } from './components/SettingsView';
import { AstarRun } from './control/Algorithm';
import { useRef, useState } from 'react';
import { AlgorithmMode, RenderMode } from './utils/types';
import css from './App.module.css';

export type AppState = {
    algorithm: AlgorithmMode;
    diagonals: boolean;
    renderMode: RenderMode;
    alerts: boolean;
};

export const App: React.FC = () => {
    const interval = useRef<NodeJS.Timer | undefined>(undefined);
    const grid = useRef<Grid>(new Grid());
    const [state, setState] = useState<AppState>({
        algorithm: 0,
        diagonals: true,
        renderMode: RenderMode.Square,
        alerts: true,
    });

    const onDijkstraRun = (): void => {
        // TODO add
    };

    const onRun = (): void => {
        switch (state.algorithm) {
            case AlgorithmMode.Astar:
                AstarRun(grid.current, state, onFinish);
                break;
            case AlgorithmMode.Dijkstra:
                onDijkstraRun();
                break;
        }
    };

    const onFinish = (): void => {
        if (interval.current) {
            clearInterval(interval.current);
        }
    };

    const onBegin = (): void => {
        if (grid.current.state.finished) {
            grid.current.resetGrid(false, state.diagonals, state.renderMode);
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
            <SettingsView grid={grid.current} appState={state} setAppState={setState} onBegin={onBegin} />
        </div>
    );
};