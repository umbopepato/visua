import {inRange} from '../util';
import {CSSStyleValue} from './css-style-value';

export enum CSSTimingFunction {
    ease = 'ease',
    easeIn = 'ease-in',
    easeOut = 'ease-out',
    easeInOut = 'ease-in-out',
    linear = 'linear',
    stepStart = 'step-start',
    stepEnd = 'step-end',
    cubicBezier = 'cubic-bezier',
    steps = 'steps',
    frames = 'frames',
}

export enum CSSStepPosition {
    start = 'start',
    end = 'end',
}

export class CSSTimingFunctionValue extends CSSStyleValue {

    constructor(public type: CSSTimingFunction) {
        super();
    }

    is(type: string | CSSTimingFunction): boolean {
        return this.type === type;
    }

    toString() {
        return `${this.type}`;
    }

}

export class CSSCubicBezierTimingFunction extends CSSTimingFunctionValue {

    constructor(public x1: number, public y1: number, public x2: number, public y2: number) {
        super(CSSTimingFunction.cubicBezier);
        if (!inRange(x1, 0, 1)) throw new TypeError('Failed to construct CSSCubicBezierFunction: Coordinate x1 is not in [0, 1]');
        if (!inRange(x2, 0, 1)) throw new TypeError('Failed to construct CSSCubicBezierFunction: Coordinate x2 is not in [0, 1]');
    }

    toString() {
        return `${super.toString()}(${this.x1}, ${this.y1}, ${this.x2}, ${this.y2})`;
    }

}

export class CSSStepsTimingFunction extends CSSTimingFunctionValue {

    constructor(public steps: number, public position: CSSStepPosition = CSSStepPosition.end) {
        super(CSSTimingFunction.steps);
        if (!Number.isInteger(steps) || steps <= 0) throw new TypeError('Failed to construct CSSStepsTimingFunction: Argument steps must be a positive integer');
    }

    toString() {
        return `${super.toString()}(${this.steps}${this.position === CSSStepPosition.end ? '' : `, ${this.position}`})`;
    }

}

export class CSSFramesTimingFunction extends CSSTimingFunctionValue {

    constructor(public frames: number) {
        super(CSSTimingFunction.frames);
        if (!Number.isInteger(frames) || frames < 1) throw new TypeError('Failed to construct CSSFramesTimingFunction: Argument frames must be an integer grater than 1');
    }

    toString() {
        return `${super.toString()}(${this.frames})`;
    }

}
