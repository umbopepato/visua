#!/usr/bin/env node

import * as cssTree from 'css-tree';
import AstCssomConverter from "./ast-cssom-converter";
import * as fs from "fs";
import {CSSHexColor, CSSHslaColor, CSSRgbaColor} from './css-color-value';
import {CSS} from './css';
import * as program from 'commander';
import {InitCommand} from './commands/init';

program
    .version('0.0.1')
    .alias('-v');

program.command('init')
    .alias('initialize')
    .action(() => {
        new InitCommand();
    });

program.parse(process.argv);

/*
// let data = yaml.parse(yaml.readSync(process.cwd() + '/identt.yaml'));
// console.log(data);

// const configFile = fs.readFileSync(process.cwd() + '/identt.css', 'utf8');
const css = `
--primary-color: #AFAFAF;
`;

const ast = cssTree.parse(css, {
    context: 'declarationList',
    parseCustomProperty: true
});

// console.log(JSON.stringify(ast, null, 2));
//
// // try {
//     let cssOm = new AstCssomConverter(ast).getStyleMap();
//     console.log((cssOm.get('primary-color') as CSSHexColor).to('hsla'));
    // console.log((cssOm.get('aciao') as CSSHexColor).to('rgb'));
    /!*let cssOm = AstCssomTools.astDefListToCssOm(ast);
    console.log(cssOm);*!/
// } catch (e) {
//     console.error(`Config syntax error: ${e.message}.`);
// }

console.log(CSS.px(12).to('cm'));*/
