import {expect} from 'chai';
import {
    CSSCubicBezierTimingFunction,
    CSSFramesTimingFunction,
    CSSStepsTimingFunction,
    CSSTimingFunction,
    CSSTimingFunctionValue,
} from '../src/cssom/css-timing-function-value';

describe('CSSCubicBezierTimingFunction', () => {

    describe('constructor', () => {

        it('should throw an error if x1 or x2 are not in the range [0, 1]', () => {

            expect(() => new CSSCubicBezierTimingFunction(-1, 2, 1, 2)).to.throw();

        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSCubicBezierTimingFunction(0.1, 2, 1, 2).toString())
                .to.be.equal(`cubic-bezier(0.1, 2, 1, 2)`);

        });

    });

});

describe('CSSStepsTimingFunction', () => {

    describe('constructor', () => {

        it('should throw an error if steps is not a positive integer', () => {

            expect(() => new CSSStepsTimingFunction(-2)).to.throw();

        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSStepsTimingFunction(3).toString())
                .to.be.equal(`steps(3)`);

        });

    });

});

describe('CSSFramesTimingFunction', () => {

    describe('constructor', () => {

        it('should throw an error if frames is not an integer grater than 1', () => {

            expect(() => new CSSFramesTimingFunction(0.1)).to.throw();

        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSFramesTimingFunction(3).toString())
                .to.be.equal(`frames(3)`);

        });

    });

});

describe('CSSTimingFunctionValue', () => {

    describe('constructor', () => {

        it('should create a CSSTimingFunctionValue from a CSSTimingFunction', () => {

            expect(new CSSTimingFunctionValue(CSSTimingFunction.cubicBezier));

        });

    });

    describe('#is()', () => {

        it('should return true if type is equal to the function type', () => {

            expect(new CSSTimingFunctionValue(CSSTimingFunction.steps).is('steps'))
                .to.be.equal(true);

        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSTimingFunctionValue(CSSTimingFunction.steps).toString())
                .to.be.equal(`steps`);

        });

    });

});
