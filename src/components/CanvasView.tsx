import * as React from 'react';
import css from './CanvasView.module.css';

export const CanvasView: React.FC = () => (
    <div className={css.container}>
        <canvas
            id="myCanvas"
            width="500"
            height="500"
            className={css.canvas}
        >
                Your browser does not support the canvas element.
        </canvas>
    </div>
);