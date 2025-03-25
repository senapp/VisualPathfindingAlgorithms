import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid } from '../control/Grid';
import { ClearGrid } from '../control/Rendering';
import { AlgorithmMode, getAlgorithmName, HeuristicAlgorithmMode, RenderMode } from '../utils/types';
import { Button } from './common/Button';
import { Checkbox } from './common/Checkbox';
import { NumberInput } from './common/NumberInput';
import css from './SettingsView.module.css';

type Props = {
    grid: Grid;
    onBegin: () => void;
}

type State = {
    canvasSize: number;
    wallModifier: number;
    colsAndRows: number;
    grid: Grid;
}

export const SettingsView: React.FC<Props> = ({ grid, onBegin }) => {
    const { diagonals, renderMode, heuristicAlgorithm, algorithm, alerts } = grid.state;
    const [state, setState] = useState<State>({
        canvasSize: 400,
        wallModifier: 0.3,
        colsAndRows: 30,
        grid: grid,
    });

    useEffect(() => {
        onGridChange(state.colsAndRows);
    }, []);

    useEffect(() => {
        setState((state) => ({ ...state, grid: grid }));
    }, [grid]);

    const updateGrid = (): void => {
        setState((state) => ({ ...state, grid: grid }));
    };

    const setStartPosX = (value: number): void => {
        if (grid.cells.length > 0) {
            grid.start = grid.cells[value][grid.start.y];
            grid.resetGrid(false);
            updateGrid();
        }
    };

    const setStartPosY = (value: number): void => {
        if (grid.cells.length > 0) {
            grid.start = grid.cells[grid.start.x][value];
            grid.resetGrid(false);
            updateGrid();
        }
    };

    const setEndPosX = (value: number): void =>{
        if (grid.cells.length > 0) {
            grid.end = grid.cells[value][grid.end.y];
            grid.resetGrid(false);
            updateGrid();
        }
    };

    const setEndPosY = (value: number): void => {
        if (grid.cells.length > 0) {
            grid.end = grid.cells[grid.end.x][value];
            grid.resetGrid(false);
            updateGrid();
        }
    };

    const setWallModifier = (value: number): void => {
        setState((state) => ({ ...state, wallModifier: value }));
    };

    const onGridChange = (value: number): void => {
        setState((state) => ({ ...state, colsAndRows: value }));
        grid.createGrid(value, value, state.wallModifier);
        grid.state = ({ ...grid.state, ready: true, finished: false });
        updateGrid();
    };

    const setCanvasSize = (value: number): void => {
        setState((state) => ({ ...state, canvasSize: value }));
        grid.resizeCanvas(value);
        ClearGrid(grid);
        updateGrid();
    };

    const setRenderMode = (value: RenderMode): void => {
        grid.state = ({ ...grid.state, renderMode: value });
        grid.resetGrid(true);
        updateGrid();
    };

    const setAlgorithm = (value: number): void => {
        grid.state = ({ ...grid.state, algorithm: value });
        updateGrid();
    };

    const setHeuristicAlgorithm = (value: number): void => {
        grid.state = ({ ...grid.state, heuristicAlgorithm: value });
        updateGrid();
    };

    const setDiagonals = (value: boolean): void => {
        grid.state = ({ ...grid.state, diagonals: value });
        grid.recalculateCells();
        updateGrid();
    };

    const setAlerts = (value: boolean): void => {
        grid.state = ({ ...grid.state, alerts: value });
        updateGrid();
    };

    const onClear = (): void => {
        grid.resetGrid(false);
        updateGrid();
    };

    const onGenerate = (): void => {
        onGridChange(state.colsAndRows);
    };

    const onRandomize = (): void => {
        if (grid.cells.length > 0) {
            grid.start = grid.cells[Math.floor(Math.random() * state.colsAndRows)][Math.floor(Math.random() * state.colsAndRows)];
            grid.end = grid.cells[Math.floor(Math.random() * state.colsAndRows)][Math.floor(Math.random() * state.colsAndRows)];
            grid.resetGrid(false);
            updateGrid();
        }
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
                        {`Cells: ${state.colsAndRows * state.colsAndRows} ${(state.grid.path.length > 0 && state.grid.state.success) ? ' - Path Distance: ' + state.grid.path.length +  ' Cells' : ''} `}
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
                            label={getAlgorithmName(AlgorithmMode[value])}
                            value={algorithm === AlgorithmMode[value]}
                            onChange={() => setAlgorithm(AlgorithmMode[value])}
                        />
                    )}
                </div>
            </div>
            {algorithm === AlgorithmMode.Astar &&
                <div className={css.contentContainer}>
                    <h3>Heuristic Algorithm</h3>
                    <div className={css.horizontalContainer}>
                        {Object.values(HeuristicAlgorithmMode).filter(key => typeof HeuristicAlgorithmMode[key] === 'number').map(value =>
                            <Checkbox
                            key={value}
                            label={value.toString()}
                            value={heuristicAlgorithm === HeuristicAlgorithmMode[value]}
                            onChange={() => setHeuristicAlgorithm(HeuristicAlgorithmMode[value])}
                            />
                        )}
                    </div>
                </div>
            }
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
                        max={state.colsAndRows - 1}
                        value={grid.start.x}
                        onChange={setStartPosX}
                    />
                    <NumberInput
                        label="Start Position Y"
                        min={0}
                        max={state.colsAndRows - 1}
                        value={grid.start.y}
                        onChange={setStartPosY}
                    />
                </div>
                <div className={css.horizontalContainer}>
                    <NumberInput
                        label="End Position X"
                        min={0}
                        max={state.colsAndRows - 1}
                        value={grid.end.x}
                        onChange={setEndPosX}
                    />
                    <NumberInput
                        label="End Position Y"
                        min={0}
                        max={state.colsAndRows - 1}
                        value={grid.end.y}
                        onChange={setEndPosY}
                    />
                </div>
                <div className={css.buttonBar}>
                    <Button label="Start" onClick={onBegin} className={css.startButton} />
                    <Button label="Clear" onClick={onClear} className={css.clearButton} />
                    <Button label="Generate" onClick={onGenerate} className={css.generateButton} />
                    <Button label="Randomize Positions" onClick={onRandomize} className={css.randomizeButton} />
                </div>
            </div>
        </div>
    );
};