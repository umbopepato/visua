import {DOMMatrix} from './dom-matrix';

export interface CSSTransformComponent {
    is2D: boolean;

    toMatrix(): DOMMatrix;
}

export class CSSTransformValue {

    get length(): number {
        return this.transforms.length;
    }

    constructor(private transforms: CSSTransformComponent[]) {
        if (!transforms.length) {
            throw new TypeError('Failed to construct CSSTransformValue: Argument transform is empty');
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

    toString(): string {
        return this.transforms.join(' ');
    }

}