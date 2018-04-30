#!/usr/bin/env node

import * as cssTree from 'css-tree';
import validateAst from './validate-ast';
import astDefListToCssOm from "./ast-to-cssom";
import * as fs from "fs";

const [, , ...args] = process.argv;

// let data = yaml.parse(yaml.readSync(process.cwd() + '/identt.yaml'));
// console.log(data);

// const configFile = fs.readFileSync(process.cwd() + '/identt.css', 'utf8');
const css = `
--background-position: 12px;
`;

const ast = cssTree.parse(css, {
    context: 'declarationList',
    parseCustomProperty: true
});
console.log(JSON.stringify(ast));

try {
    validateAst(ast);
    let cssOm = astDefListToCssOm(ast);
    console.log(cssOm);
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
