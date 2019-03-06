import {logger} from '../../logger';
import {Plugin} from '../../plugin';
import {StyleMap, visua} from '../../visua';
import * as path from 'path';

export const run = (options, args: string[]) => {
    let styleMap: StyleMap;
    try {
        styleMap = visua({
            path: options.path,
            strict: options.strict,
        });
    } catch (e) {
        logger.error(e.formattedMessage || e.stack || e);
        return;
    }
    let pluginsArgs: string[][] = [];
    for (let arg of args) {
        if (!arg.startsWith('--')) {
            pluginsArgs.push([arg]);
        } else {
            pluginsArgs[pluginsArgs.length - 1].push(arg);
        }
    }
    for (let pluginArgs of pluginsArgs) {
        let PluginClass;
        let plugin;
        try {
            // TODO consider supporting global packages and parallelization
            PluginClass = require(path.join(process.cwd(), 'node_modules', `visua-${pluginArgs[0]}`)).default;
            plugin = new PluginClass();
        } catch (error) {
            logger.error(`Error: Cannot find plugin named visua-${pluginArgs[0]}.\n\n` +
            `Make sure that you have run \`npm install visua-${pluginArgs[0]}\` and check that you have typed correctly the name of the plugin.\n` +
            `Also, when you run \`visua run <plugin name>\` you don't have to prepend visua- to the name of the plugin (i.e. visua-bootstrap -> visua run bootstrap).\n` +
            `(Plugins installed as global packages are not supported yet)`);
            return;
        }
        if (plugin != null) {
            let pluginOptions = {};
            let optionInitializers = PluginClass.options;
            for (let i = 1; i < pluginArgs.length; i++) {
                let [optName, optVal] = pluginArgs[i].split('=');
                optName = optName.substr(2);
                if (optName in optionInitializers) {
                    if (optionInitializers[optName] === Boolean) {
                        if (optVal == null) {
                            pluginOptions[optName] = true;
                        } else {
                            pluginOptions[optName] = optVal.toLowerCase() === 'true';
                        }
                    } else if (optVal != null) {
                        pluginOptions[optName] = optionInitializers[optName](optVal);
                    }
                }
            }
            Object.entries(optionInitializers)
                .filter(i => i[1] === Boolean)
                .map(i => i[0])
                .forEach(i => {
                    if (!(i in pluginOptions)) {
                        pluginOptions[i] = false;
                    }
                });
            try {
                plugin.run(styleMap, pluginOptions);
            } catch (e) {
                logger.error(e.formattedMessage || e.stack || e);
                logger.warn(`An error occurred during the execution of the ${pluginArgs[0]} plugin (see above).`);
            }
        }
    }
};
