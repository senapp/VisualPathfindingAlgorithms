import { CanvasContext, RenderMode } from '../utils/types';
import { Cell } from './Cell';
import { Grid } from './Grid';

export const GetCanvas = (): CanvasContext => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    if (!canvas) {
        return { ctx: null, canvas: null };
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return { ctx: null, canvas: null };
    }

    return { ctx: ctx, canvas: canvas };
};

export const ClearGrid = (grid: Grid): void => {
    const { renderMode } = grid.state;
    const { ctx, canvas } = GetCanvas();
    if (!ctx || !canvas) {
        return;
    }

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    if (renderMode !== RenderMode.None) {
        grid.cells.forEach(cellCol => {
            cellCol.forEach(cell => {
                if (renderMode !== RenderMode.Line) {
                    if (cell === grid.start || cell === grid.end) {
                        Show(cell, 'yellow', grid, ctx);
                    } else if (cell.wall) {
                        Show(cell, 'black', grid, ctx);
                    } else if (grid.path.includes(cell)) {
                        Show(cell, 'blue', grid, ctx);
                    } else if (grid.openset.includes(cell)) {
                        Show(cell, 'green', grid, ctx);
                    } else if (grid.closedset.includes(cell)) {
                        Show(cell, 'red', grid, ctx);
                    } else {
                        Show(cell, 'white', grid, ctx);
                    }
                } else if (cell.wall) {
                    Show(cell, 'black', grid, ctx);
                }
            });
        });

        if (renderMode === RenderMode.Line) {
            ShowLinePath(ctx, grid);
        }
    }
};

export const RenderGrid = (grid: Grid): void => {
    const { renderMode } = grid.state;
    const { ctx, canvas } = GetCanvas();
    if (!ctx || !canvas || renderMode === RenderMode.None) {
        return;
    }

    if (renderMode !== RenderMode.Line) {
        grid.closedset.forEach(cell => {
            Show(cell, 'red', grid, ctx);
        });

        grid.openset.forEach(cell => {
            Show(cell, 'green', grid, ctx);
        });

        grid.path.forEach(cell => {
            Show(cell, 'blue', grid, ctx);
        });
    } else {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        grid.cells.forEach(cellCol => {
            cellCol.forEach(cell => {
                if (cell.wall) {
                    Show(cell, 'black', grid, ctx);
                }
            });
        });

        ShowLinePath(ctx, grid);
    }
};

const ShowLinePath = (ctx: CanvasRenderingContext2D, grid: Grid): void => {
    ctx.beginPath();
    for (let i = 0; i < grid.path.length; i++) {
        ctx.lineTo(grid.path[i].x * grid.w + grid.w / 2, grid.path[i].y * grid.h + grid.h / 2);
        ctx.moveTo(grid.path[i].x * grid.w + grid.w / 2, grid.path[i].y * grid.h + grid.h / 2);
    }
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = (grid.w + grid.h) / 4;
    ctx.lineCap = 'round';
    ctx.stroke();
};


const Show = (cell: Cell, fill: string, grid: Grid, ctx: CanvasRenderingContext2D): void => {
    const { h, w } = grid;
    const { renderMode } = grid.state;

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    if (renderMode === RenderMode.Square) {
        ctx.rect(cell.x * w, cell.y * h, w - 1, h - 1);
    } else if (renderMode === RenderMode.Circle) {
        ctx.arc(cell.x * w + w / 2, cell.y * h + h / 2, (w + h) / 4, 0, Math.PI * 2);
    } else if (renderMode === RenderMode.Line && cell.wall) {
        ctx.arc(cell.x * w + w / 2, cell.y * h + h / 2, (w + h) / 8, 0, Math.PI * 2);
    }

    if (renderMode !== RenderMode.Line || cell.wall) {
        ctx.fillStyle = cell.wall ? 'black' : fill;
        ctx.fill();
    }

    ctx.stroke();
};