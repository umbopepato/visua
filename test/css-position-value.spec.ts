import {expect} from 'chai';
import {CSSPositionValue} from '../src/cssom/css-position-value';
import {CSSKeywordValue} from '../src/cssom/css-keyword-value';
import {CSS} from '../src/cssom/css';

describe('CSSPosition', () => {

    describe('constructor', () => {

        it('should construct a CSSPositionValue from one (horizontal) keyword', () => {
            expect(new CSSPositionValue(new CSSKeywordValue('left')))
                .to.have.property('x').to.be.deep.equal(CSS.percent(0));
        });

        it('should construct a CSSPositionValue from one (vertical) keyword', () => {
            expect(new CSSPositionValue(new CSSKeywordValue('bottom')))
                .to.have.property('y').to.deep.equal(CSS.percent(100));
        });

        it('should construct a CSSPositionValue from two keywords', () => {
            let posValue = new CSSPositionValue(
                new CSSKeywordValue('right'),
                new CSSKeywordValue('bottom')
            );
            expect(posValue)
                .to.have.property('x')
                .to.deep.equal(CSS.percent(100));
            expect(posValue)
                .to.have.property('y')
                .to.deep.equal(CSS.percent(100));
        });

        it('should construct a CSSPositionValue from one <length-percentage>', () => {
            expect(new CSSPositionValue(CSS.px(25)))
                .to.have.property('x')
                .to.be.deep.equal(CSS.px(25));
        });

        it('should construct a CSSPositionValue from two <length-percentage>s', () => {
            let posValue = new CSSPositionValue(CSS.px(25), CSS.mm(36));
            expect(posValue)
                .to.have.property('x')
                .to.deep.equal(CSS.px(25));
            expect(posValue)
                .to.have.property('y')
                .to.deep.equal(CSS.mm(36));
        });

    });



});