import {expect} from 'chai';
import {CSSTransformValue} from '../src/css-transform-value';
import {CSSTranslate} from '../src/css-translate';
import {CSS} from '../src/css';
import {CSSRotate} from '../src/css-rotate';


describe('CSSTransformValue', () => {

    describe('constructor', () => {

        it('should create a transform value from a list of transform components', () => {
            expect(new CSSTransformValue([
                new CSSTranslate(CSS.px(10), CSS.px(20)),
                new CSSRotate(CSS.deg(20)),
            ]).transforms.length).to.be.equal(2);
        });

    });

});