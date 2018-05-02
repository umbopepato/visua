#!/usr/bin/env node

import * as cssTree from 'css-tree';
import AstCssomConverter from "./ast-cssom-converter";
import * as fs from "fs";
import CSS from "./css";

const [, , ...args] = process.argv;

// let data = yaml.parse(yaml.readSync(process.cwd() + '/identt.yaml'));
// console.log(data);

// const configFile = fs.readFileSync(process.cwd() + '/identt.css', 'utf8');
const css = `
--a: url(https://image.png);
`;

const ast = cssTree.parse(css, {
    context: 'declarationList',
    parseCustomProperty: true
});
console.log(JSON.stringify(ast, null, 2));
try {
    let cssOm = new AstCssomConverter(ast).getCssOm();
    console.log(cssOm);
    console.log(cssOm.get('a').isRemote);
    /*let cssOm = AstCssomTools.astDefListToCssOm(ast);
    console.log(cssOm);*/
} catch (e) {
    console.error(`Config syntax error: ${e.message}.`);
}
