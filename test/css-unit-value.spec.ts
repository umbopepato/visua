import {expect} from 'chai';
import {CSSUnitValue} from '../src/cssom/css-unit-value';
import {CSSUnit} from '../src/cssom/css';

describe('CSSUnitValue', () => {

    describe('constructor', () => {

        it('should create a CSSUnitValue from a value and a unit', () => {

            expect(new CSSUnitValue(1, CSSUnit.deg));

        });

    });

    describe('#toUnit()', () => {

        it('should convert the CSSUnitValue to another unit', () => {

            expect(new CSSUnitValue(360, CSSUnit.deg).toUnit(CSSUnit.rad))
                .to.be.deep.equal(new CSSUnitValue(2 * Math.PI, CSSUnit.rad));

        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSUnitValue(1, CSSUnit.px).toString())
                .to.be.equal(`1px`);

        });

    });

});
