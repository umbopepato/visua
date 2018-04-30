#!/usr/bin/env node

import * as cssTree from 'css-tree';
import AstCssomConverter from "./ast-cssom-converter";
import * as fs from "fs";

const [, , ...args] = process.argv;

// let data = yaml.parse(yaml.readSync(process.cwd() + '/identt.yaml'));
// console.log(data);

// const configFile = fs.readFileSync(process.cwd() + '/identt.css', 'utf8');
const css = `
--a: 13px;
--background-position: 12px;
--color: calc(12px + 16%);
`;

const ast = cssTree.parse(css, {
    context: 'declarationList',
    parseCustomProperty: true
});
console.log(JSON.stringify(ast, null, 2));
try {
    let cssOm = new AstCssomConverter(ast).getCssOm();
    console.log(cssOm);
    /*let cssOm = AstCssomTools.astDefListToCssOm(ast);
    console.log(cssOm);*/
} catch (e) {
    console.error(`Config syntax error: ${e.message}.`);
}

/*
const objectModel = ast.rules.map(rule => {
    console.log(JSON.stringify(parseAsValue(rule.value.text)));
    return {
        name: rule.name,
        value: parseAsValue(rule.value.text)
    };
});
console.log(JSON.stringify(objectModel));*/
