import {expect} from 'chai';
import {visua} from '../src/visua';
import {CSSHexColor} from '../src/cssom/css-color-value';

describe('visua', () => {

    it('should create a StyleMap from one or more identity css files', (done) => {
        visua('test/style.css')
            .then(styleMap => {
                expect(styleMap.get('--background-color')).to.be.instanceOf(CSSHexColor);
                done();
            });
    });

});