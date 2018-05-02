import {DOMMatrix} from './dom-matrix';

export interface CSSTransformComponent {

    is2D: boolean;
    toMatrix(): DOMMatrix;

}