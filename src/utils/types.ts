export enum AlgorithmMode {
    Astar = 0,
    Dijkstra = 1
}

export enum RenderMode {
    Square = 0,
    Circle = 1,
    Line = 2,
    None = 3,
}


export type CanvasContext = {
    ctx: CanvasRenderingContext2D | null;
    canvas: HTMLCanvasElement | null;
}