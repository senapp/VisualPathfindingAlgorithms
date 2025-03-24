import { HeuristicAlgorithmMode } from "./types";

export const removeElementArray = <T>(arr: T[], ele: T): void => {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == ele) {
            arr.splice(i, 1);
        }
    }
};
export const heuristic = (a: { x: number; y: number }, b: { x: number; y: number }, mode: HeuristicAlgorithmMode): number => {
    switch (mode) {
        default:
        case HeuristicAlgorithmMode.Euclidean: return euclidean(a.x, a.y, b.x, b.y);
        case HeuristicAlgorithmMode.Manhattan: return manhattan(a.x, a.y, b.x, b.y);
        case HeuristicAlgorithmMode.Chebyshev: return chebyshev(a.x, a.y, b.x, b.y);
        case HeuristicAlgorithmMode.Octile: return octile(a.x, a.y, b.x, b.y);
    }
};

export const manhattan = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export const euclidean = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

export const chebyshev = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

export const octile = (x1: number, y1: number, x2: number, y2: number, D1: number = 1, D2: number = Math.SQRT2): number => {
    let dx = Math.abs(x1 - x2);
    let dy = Math.abs(y1 - y2);
    return (D2 - D1) * Math.min(dx, dy) + D1 * (dx + dy);
}