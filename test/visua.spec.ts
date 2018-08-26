import {expect} from 'chai';
import {visua} from '../src/visua';
import {CSSHexColor} from '../src/cssom/css-color-value';
import {StyleMap} from '../src/cssom/style-map';

describe('visua()', () => {

    it('should create a StyleMap from one or more identity css files', (done) => {
        visua('test/style.css')
            .then(styleMap => {
                console.log('color', styleMap.get('--background-color'));
                expect(styleMap.get('--background-color')).to.be.instanceOf(CSSHexColor);
                done();
            });
    });

});