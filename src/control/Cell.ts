export class Cell {
    f: number;
    g: number;
    h: number;

    x: number;
    y: number;

    previous: Cell | undefined;
    neighbours: (Cell | undefined)[];

    wall: boolean;

    constructor(x: number, y: number, wallModifier: number) {
        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.x = x;
        this.y = y;

        this.previous = undefined;
        this.neighbours = [];
        this.wall = false;

        if (Math.random() < wallModifier) {
            this.wall = true;
        }
    }
}