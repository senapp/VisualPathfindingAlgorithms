export const removeElemnentArray = <T>(arr: T[], ele: T): void => {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == ele) {
            arr.splice(i, 1);
        }
    }
};
export const heuristic = (a: { x: number; y: number }, b: { x: number; y: number }): number => {
    //var d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    const d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return d;
};
