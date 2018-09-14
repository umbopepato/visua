import {logger} from '../../logger';
import {Plugin} from '../../plugin';
import {StyleMap, visua} from '../../visua';

export const run = async (options, args: string[]) => {
    let styleMap: StyleMap;
    try {
        styleMap = await visua({
            path: options.path,
            strict: options.strict,
        });
    } catch (e) {
        logger.error(e.formattedMessage || e.stack || e);
        return;
    }
    let tasksArgs: string[][] = [];
    for (let arg of args) {
        if (!arg.startsWith('--')) {
            tasksArgs.push([arg]);
        } else {
            tasksArgs[tasksArgs.length - 1].push(arg);
        }
    }
    for (let taskArgs of tasksArgs) {
        let PluginClass;
        let plugin;
        try {
            // TODO consider supporting global packages and parallelization
            PluginClass = require(`${process.cwd()}/node_modules/visua-${taskArgs[0]}`).default;
            plugin = new PluginClass();
            console.log(plugin);
        } catch (error) {
            logger.error(`Error: Cannot find plugin named visua-${taskArgs[0]}.\n\nMake sure that you have run \`npm install --save visua-${taskArgs[0]}\` and check that you have typed correctly the name of the plugin.\nAlso, when you run \`visua run <plugin name>\` you don't have to prepend visua- to the name of the plugin (i.e. visua-bootstrap -> visua run bootstrap).\n(Plugins installed as global packages are not yet supported)`);
            return;
        }
        if (plugin != null) {
                let pluginOptions = {};
                let optionInitializers = PluginClass.options;
                for (let i = 1; i < taskArgs.length; i++) {
                    let [optName, optVal] = taskArgs[i].split('=');
                    optName = optName.substr(2);
                    if (optionInitializers.hasOwnProperty(optName)) {
                        pluginOptions[optName] = optionInitializers[optName](optVal);
                    }
                }
                plugin.run(styleMap, pluginOptions);
        } else {
            throw new TypeError(`${plugin.name} must extend the Plugin class`);
        }
    }
};