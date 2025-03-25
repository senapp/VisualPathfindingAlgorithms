import * as React from 'react';
import css from './CanvasView.module.css';

export const CanvasView: React.FC = () => (
    <div className={css.container}>
        <canvas
            id="myCanvas"
            width="400"
            height="400"
            className={css.canvas}
        >
                Your browser does not support the canvas element.
        </canvas>
    </div>
);