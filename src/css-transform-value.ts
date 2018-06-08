import {CSSTransformComponent} from './css-transform-component';
import {DOMMatrix} from './dom-matrix';

export class CSSTransformValue {

    get length(): number {
        return this.transforms.length;
    }

    constructor(private transforms: CSSTransformComponent[]) {
        if (!transforms.length) {
            throw new TypeError(`Failed to construct CSSTranformValue: Parameter transform is empty`)
        }
    }

    get(index: number): CSSTransformComponent {
        return this.transforms[index];
    }

    append(component: CSSTransformComponent): number {
        return this.transforms.push(component);
    }

    get is2D(): boolean {
        return this.transforms.every(c => c.is2D);
    }

    toMatrix(): DOMMatrix {
        return this.transforms
            .map(t => t.toMatrix())
            .reduce((a, v) => a.multiply(v));
    }

}