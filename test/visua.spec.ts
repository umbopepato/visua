import {expect} from 'chai';
import {visua} from '../src/visua';
import {CSSHexColor} from '../src/cssom/css-color-value';

describe('visua()', () => {

    it('should create a StyleMap from one or more identity css files', (done) => {
        visua({
            path: 'test/identity.css',
            strict: true,
        }).then(styleMap => {
            const bg = styleMap.get('--background-color');
            expect(bg).to.be.instanceOf(CSSHexColor);
            done();
        });
    });

});