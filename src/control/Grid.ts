import { AlgorithmMode, HeuristicAlgorithmMode, RenderMode } from '../utils/types';
import { Cell } from './Cell';
import { ClearGrid, GetCanvas } from './Rendering';

export type GridState = {
  ready: boolean;
  finished: boolean;
  running: boolean;
  cleared: boolean;
  t0: number;
  t1: number;
  heuristicAlgorithm: HeuristicAlgorithmMode;
  algorithm: AlgorithmMode;
  diagonals: boolean;
  renderMode: RenderMode;
  alerts: boolean;
  customInit: boolean;
  success: boolean;
}

export class Grid {
    w: number;
    h: number;
    start: Cell;
    end: Cell;
    cells: Cell[][];
    openset: Cell[];
    closedset: Cell[];
    path: Cell[];
    cols: number;
    rows: number;
    cleared: boolean;
    state: GridState;

    constructor() {
        this.cleared = true;
        this.start = new Cell(0,0,0);
        this.end = new Cell(0,0,0);
        this.cells = [];
        this.openset = [];
        this.closedset = [];
        this.path = [];
        this.state = <GridState>{
            ready: false,
            finished: false,
            running: false,
            cleared: true,
            t0: 0,
            t1: 0,
            alerts: true,
            algorithm: AlgorithmMode.Astar,
            heuristicAlgorithm: HeuristicAlgorithmMode.Euclidean,
            renderMode: RenderMode.Square,
            diagonals: true,
            customInit: false,
            success: false,
        };
    }

    public resizeCanvas(size?: number): void {
        const { canvas } = GetCanvas();
        if (!canvas) {
            return;
        }

        if (size) {
            canvas.width = size;
            canvas.height = size;
        }

        const { width, height } = canvas;

        this.w = width / this.cols;
        this.h = height / this.rows;
    }

    public createGrid(_cols: number, _rows: number, wallModifier: number): void {
        this.cells = [];
        this.openset = [];
        this.closedset = [];
        this.path = [];
        this.cols = _cols;
        this.rows = _rows;
        this.cells = new Array(this.cols);
        this.cleared = true;

        this.resizeCanvas();

        for (let i = 0; i < this.cols; i++) {
            this.cells[i] = new Array(this.rows);
        }

        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.cells[x][y] = new Cell(x, y, wallModifier);
            }
        }

        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.addNeighboursToCell(this.cells[x][y]);
            }
        }

        [[this.start]] = this.cells;
        this.start.wall = false;

        this.end = this.cells[this.cols - 1][this.rows - 1];
        this.end.wall = false;

        this.openset.push(this.start);

        ClearGrid(this);
    }

    public resetGrid(keepPath: boolean): void {
        this.start.wall = false;
        this.end.wall = false;
        
        if (!keepPath) {
            this.state.customInit = false;
            this.state.success = false;
            this.cleared = true;
            this.openset = [];
            this.openset.push(this.start);
            this.closedset = [];
            this.path = [];
            this.recalculateCells();
        }

        ClearGrid(this);
    }

    public recalculateCells(): void {
        if (this.cols < 1) {
            return;
        }
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.cells[x][y].neighbours = [];
                this.cells[x][y].f = 0;
                this.cells[x][y].g = 0;
                this.cells[x][y].h = 0;
                this.cells[x][y].x = x;
                this.cells[x][y].y = y;
                this.cells[x][y].previous = undefined;
                this.addNeighboursToCell(this.cells[x][y]);
            }
        }
    }

    private addNeighboursToCell(cell: Cell): void {
        if (cell.x < this.cols - 1) {
            cell.neighbours.push(this.cells[cell.x + 1][cell.y]);
        }
        if (cell.x > 0) {
            cell.neighbours.push(this.cells[cell.x - 1][cell.y]);
        }
        if (cell.y < this.rows - 1) {
            cell.neighbours.push(this.cells[cell.x][cell.y + 1]);
        }
        if (cell.y > 0) {
            cell.neighbours.push(this.cells[cell.x][cell.y - 1]);
        }

        if (this.state.diagonals) {
            if (cell.y > 0 && cell.x > 0) {
                cell.neighbours.push(this.cells[cell.x - 1][cell.y - 1]);
            }
            if (cell.y > 0 && cell.x < this.cols - 1) {
                cell.neighbours.push(this.cells[cell.x + 1][cell.y - 1]);
            }
            if (cell.y < this.rows - 1 && cell.x > 0) {
                cell.neighbours.push(this.cells[cell.x - 1][cell.y + 1]);
            }
            if (cell.y < this.rows - 1 && cell.x < this.cols - 1) {
                cell.neighbours.push(this.cells[cell.x + 1][cell.y + 1]);
            }
        }
    }
}
