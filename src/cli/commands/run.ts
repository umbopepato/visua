import {loadStyles} from '../load-styles';
import {logger} from '../../logger';

export const run = async (args: string[]) => {
    try {
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
            let taskFn;
            try {
                taskFn = require(`${process.cwd()}/node_modules/visua-${taskArgs[0]}`).default;
            } catch (error) {
                logger.error(`Error: Cannot find plugin named visua-${taskArgs[0]}.\n\nMake sure that you have run \`npm install --save visua-${taskArgs[0]}\` and check that you have typed correctly the name of the plugin.\nAlso, when you run \`visua run <plugin name>\` you don't have to prepend visua- to the name of the plugin (i.e. visua-bootstrap -> visua run bootstrap).\n(Plugins installed as global packages are not yet supported)`);
            }
            if (taskFn != null) {
                if (typeof taskFn === 'function') {
                    let args = {};
                    for (let i = 1; i < taskArgs.length; i++) {
                        let [argName, argVal] = taskArgs[i].split('=');
                        args[argName.substr(2)] = argVal || '';
                    }
                    taskFn(styleMap, args);
                } else {
                    throw new TypeError(`${taskFn.name} is not a function`);
                }
            }
        }
    } catch (error) {
        logger.error(error.formattedMessage || error);
    }
};