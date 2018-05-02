import {CSSTransformComponent} from './css-transform-component';
import {DOMMatrix} from './dom-matrix';

export class CSSTransformValue {

    components: CSSTransformComponent[] = [];
    readonly length: number;

    get(index: number): CSSTransformComponent {
        return this.components[index];
    }

    append(component: CSSTransformComponent): number {
        return this.components.push(component);
    }

    get is2D(): boolean {
        return this.components.every(c => c.is2D);
    }

    toMatrix(): DOMMatrix {
        // TODO
    }

}