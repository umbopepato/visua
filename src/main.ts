#!/usr/bin/env node

import * as cssTree from 'css-tree';
import AstCssomConverter from './ast-cssom-converter';
import * as util from 'util';
import * as fs from 'fs';
import {CSSHexColor, CSSHslaColor, CSSRgbaColor} from './css-color-value';
import {CSS} from './css';
import * as program from 'commander';
import {InitCommand} from './commands/init';

/*program
    .version('0.0.1')
    .alias('-v');

program.command('init')
    .alias('initialize')
    .action(() => {
        new InitCommand();
    });

program.parse(process.argv);*/

const css = `
--prova: scale(1);
`;

const ast = cssTree.parse(css, {
    context: 'declarationList',
    parseCustomProperty: true,
});

console.log(JSON.stringify(ast, null, 2));

let cssOm = new AstCssomConverter(ast).getStyleMap();
console.log(util.inspect(cssOm, false, null));

