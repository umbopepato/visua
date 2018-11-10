#!/usr/bin/env node
import * as program from 'commander';
import {init} from './commands/init';
import {run} from './commands/run';
import {list} from './commands/list';

program
    .version('0.0.1')
    .option('-s, --strict', 'exit on parse errors', false)
    .option('-p, --path <mainFile>', 'path to the main identity file');

program.command('init')
    .alias('initialize')
    .action(init);

program.command('list')
    .alias('ls')
    .action(list);

program.command('run')
    .allowUnknownOption()
    .action(() => {
        let rawArgs = program.rawArgs;
        let globalOptions = {
            path: program.path,
            strict: program.strict,
        };
        run(globalOptions, rawArgs.slice(rawArgs.indexOf('run') + 1));
    });

program.parse(process.argv);