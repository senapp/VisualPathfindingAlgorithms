import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppState } from '../App';
import { AlgorithmMode } from '../control/Algorithm';
import { Grid } from '../control/Grid';
import { ClearGrid, RenderMode } from '../control/Rendering';
import { Button } from './common/Button';
import { Checkbox } from './common/Checkbox';
import { NumberInput } from './common/NumberInput';
import css from './SettingsView.module.css';

type Props = {
    grid: Grid;
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    onBegin: () => void;
}

type State = {
    canvasSize: number;
    wallModifier: number;
    colsAndRows: number;
}

export const SettingsView: React.FC<Props> = ({ grid, appState, setAppState, onBegin }) => {
    const [state, setState] = useState<State>({
        canvasSize: 500,
        wallModifier: 0.3,
        colsAndRows: 25,
    });

    useEffect(() => {
        onGridChange(state.colsAndRows);
    }, []);

    const { diagonals, renderMode, algorithm, alerts } = appState;

    const setStartPosX = (value: number): void => {
        if (grid.cells.length > 0) {
            grid.start = grid.cells[value][grid.start.y];
            grid.resetGrid(false, diagonals, renderMode);
        }
    };

    const setStartPosY = (value: number): void => {
        if (grid.cells.length > 0) {
            grid.start = grid.cells[grid.start.x][value];
            grid.resetGrid(false, diagonals, renderMode);
        }
    };

    const setEndPosX = (value: number): void =>{
        if (grid.cells.length > 0) {
            grid.end = grid.cells[value][grid.end.y];
            grid.resetGrid(false, diagonals, renderMode);
        }
    };

    const setEndPosY = (value: number): void => {
        if (grid.cells.length > 0) {
            grid.end = grid.cells[grid.end.x][value];
            grid.resetGrid(false, diagonals, renderMode);
        }
    };

    const setWallModifier = (value: number): void => {
        setState((state) => ({ ...state, wallModifier: value }));
    };

    const onGridChange = (value: number): void => {
        setState((state) => ({ ...state, colsAndRows: value }));
        grid.createGrid(state.colsAndRows, state.colsAndRows, state.wallModifier, diagonals, renderMode);
        grid.state = ({ ...grid.state, ready: true, finished: false });
    };

    const setCanvasSize = (value: number): void => {
        setState((state) => ({ ...state, canvasSize: value }));
        grid.resizeCanvas(value);
        ClearGrid(grid, renderMode);
    };

    const setRenderMode = (value: RenderMode): void => {
        const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        grid.resetGrid(true, diagonals, value);
        setAppState((state) => ({ ...state, renderMode: value, t0: 0 }));
        grid.state = ({ ...grid.state, t0: 0 });
    };

    const setAlgorithm = (value: number): void => {
        setAppState((state) => ({ ...state, algorithm: value }));
    };

    const setDiagonals = (value: boolean): void => {
        grid.recalculateCells(value);
        setAppState((state) => ({ ...state, diagonals: value }));
    };

    const setAlerts = (value: boolean): void => {
        setAppState((state) => ({ ...state, alerts: value }));
    };

    const onClear = (): void => {
        grid.resetGrid(false, diagonals, renderMode);
    };

    return (
        <div className={css.container}>
            <div className={css.contentContainer}>
                <div className={css.horizontalContainer}>
                    <NumberInput
                        label="Canvas Size"
                        min={200}
                        max={2000}
                        value={state.canvasSize}
                        onChange={setCanvasSize}
                    />
                </div>
                <div className={css.horizontalContainer}>
                    <NumberInput
                        label="Columns/Rows"
                        value={state.colsAndRows}
                        min={2}
                        max={1000}
                        onChange={onGridChange}
                    />
                </div>
                <div className={css.horizontalContainer}>
                    <NumberInput
                        label="Walls Modifier"
                        value={state.wallModifier}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={setWallModifier}
                    />
                </div>
            </div>
            <div className={css.contentContainer}>
                { state.colsAndRows > 0 && <h4>
                        Cells: {state.colsAndRows * state.colsAndRows}
                </h4> }
            </div>
            <div className={css.contentContainer}>
                <h3>Rendering style</h3>
                <div className={css.horizontalContainer}>
                    {Object.values(RenderMode).filter(key => typeof RenderMode[key] === 'number').map(value =>
                        <Checkbox
                            key={value}
                            label={value.toString()}
                            value={renderMode === RenderMode[value]}
                            onChange={() => setRenderMode(RenderMode[value])}
                        />
                    )}
                </div>
            </div>
            <div className={css.contentContainer}>
                <h3>Algorithms</h3>
                <div className={css.horizontalContainer}>
                    {Object.values(AlgorithmMode).filter(key => typeof AlgorithmMode[key] === 'number').map(value =>
                        <Checkbox
                            key={value}
                            label={value.toString()}
                            value={algorithm === AlgorithmMode[value]}
                            onChange={() => setAlgorithm(AlgorithmMode[value])}
                        />
                    )}
                </div>
            </div>
            <div className={css.contentContainer}>
                <h3>Options</h3>
                <div className={css.horizontalContainer}>
                    <Checkbox
                        label="Diagonals"
                        value={diagonals}
                        onChange={setDiagonals}
                    />
                    <Checkbox
                        label="Get Alerts"
                        value={alerts}
                        onChange={setAlerts}
                    />
                </div>
                <div className={css.horizontalContainer}>
                    <NumberInput
                        label="Start Position X"
                        min={0}
                        max={state.colsAndRows}
                        value={grid.start.y}
                        onChange={setStartPosX}
                    />
                    <NumberInput
                        label="Start Position Y"
                        min={0}
                        max={state.colsAndRows}
                        value={grid.start.x}
                        onChange={setStartPosY}
                    />
                </div>
                <div className={css.horizontalContainer}>
                    <NumberInput
                        label="End Position X"
                        min={0}
                        max={state.colsAndRows - 1}
                        value={grid.end.y}
                        onChange={setEndPosX}
                    />
                    <NumberInput
                        label="End Position Y"
                        min={0}
                        max={state.colsAndRows - 1}
                        value={grid.end.x}
                        onChange={setEndPosY}
                    />
                </div>
                <div className={css.buttonBar}>
                    <Button label="Start" onClick={onBegin} className={css.startButton} />
                    <Button label="Clear" onClick={onClear} className={css.clearButton} />
                </div>
            </div>
        </div>
    );
};