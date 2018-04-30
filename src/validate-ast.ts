import * as cssTree from 'css-tree'

export default function validateAst(ast) {
    let variables = getVariableReferences(ast);
    validateVariableReferences(variables);
}

function getVariableReferences(ast) {
    let variables = {};
    cssTree.walk(ast, {
        enter: node => {
            if (node.type === 'Declaration') {
                if (node.property != null && node.property.startsWith('--')) {
                    cssTree.walk(node, {
                        enter: innerNode => {
                            if (innerNode.type === 'Identifier') {
                                if (variables[node.property] === undefined) {
                                    variables[node.property] = [ innerNode.name ];
                                } else {
                                    variables[node.property].push(innerNode.name);
                                }
                            }
                        }
                    });
                }
            }
        }
    });
    return variables;
}

function validateVariableReferences(variables: {}) {
    for (let variableKey in variables) {
        if (variables[variableKey].includes(variableKey)) {
            throw new TypeError(`variable ${variableKey} references itself`);
        }
        variables[variableKey].forEach(variable => {
           if (!variables.hasOwnProperty(variable)) {
               throw new TypeError(`undefined variable ${variable}`);
           }
           if (variables[variable].includes(variableKey)) {
               throw new TypeError(`circular variable reference involving ${variableKey} and ${variable}`);
           }
        });
    }
}