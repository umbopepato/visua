import {expect} from 'chai';
import {CSSHexColor} from '../css-color-value';

describe('CSSHexColor', () => {

    describe('constructor', () => {

        it('should throw an error when arguments don\'t have the same length', function () {
            expect(() => new CSSHexColor('A', 'AB', 'AB')).to.throw();
        });

        it('should throw an error when one or more arguments are not valid hex numbers', function () {
            expect(() => new CSSHexColor('AZ', 'AB', 'AB')).to.throw();
        });

        it('should resolve an undefined alpha to FF', function () {
            expect(new CSSHexColor('AF', 'AF', 'AF')).to.have.property('a', 'FF');
        });

        it('should resolve single digit components to their hex correspondent', function () {
            const color = new CSSHexColor('A', 'B', 'C');
            expect(color).to.have.property('r', 'AA');
            expect(color).to.have.property('g', 'BB');
            expect(color).to.have.property('b', 'CC');
            expect(color).to.have.property('a', 'FF');
        });
        
    });

});