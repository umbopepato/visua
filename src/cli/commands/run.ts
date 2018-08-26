import {loadStyles} from '../load-styles';

export const run = async (args: string[]) => {
    let styleMap = await loadStyles();
    let tasksArgs: string[][] = [];
    for (let arg of args) {
        if (!arg.startsWith('--')) {
            tasksArgs.push([arg]);
        } else {
            tasksArgs[tasksArgs.length - 1].push(arg);
        }
    }
    for (let taskArgs of tasksArgs) {
         // TODO consider supporting global packages
        let taskFn = require(`${process.cwd()}/node_modules/visua-${taskArgs[0]}`);
        taskFn(styleMap);
    }
};