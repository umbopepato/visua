#!/usr/bin/env node

import * as program from 'commander';
import {init} from './commands/init';
import {run} from './commands/run';
import {list} from './commands/list';
import {plugin} from './commands/plugin';
import {logger} from '../logger';

program
    .version(require('../../package.json').version)
    .option('-s, --strict', 'exit on parse errors', false)
    .option('-p, --path <mainIdentityFile>', 'path to the main identity file');

// TODO implement init interactive shell
// program.command('initialize')
//     .alias('init')
//     .description('initializes an empty visua project')
//     .action(init);

program.command('list')
    .alias('ls')
    .description('loads identity files and displays the generated StyleMap in a table')
    .action(list);

program.command('plugin')
    .alias('pl')
    .description('starts an interactive shell to create a new plugin from the starter template')
    .action(plugin);

program.command('run')
    .description('runs one or more plugin. More info at https://visua.io/guide/visua-cli/#plugin')
    .allowUnknownOption()
    .action( () => {
        let rawArgs = program.rawArgs;
        let globalOptions = {
            path: program.path,
            strict: program.strict,
        };
        try {
            run(globalOptions, rawArgs.slice(rawArgs.indexOf('run') + 1));
        } catch (e) {
            logger.error(e.formattedMessage || e.stack || e);
        }
        process.exit();
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit();
}

program.parse(process.argv);
