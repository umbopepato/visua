#!/usr/bin/env node
import * as program from 'commander';
import {init} from './commands/init';
import {run} from './commands/run';
import {test} from './commands/test';

program
    .version('0.0.1')
    .alias('-v');

program.command('init')
    .alias('initialize')
    .option('prova')
    .action(init);

program.command('test')
    .alias('t')
    .action(test);

program.command('run')
    .allowUnknownOption(true)
    .action(() => {
        run(program.rawArgs.slice(3));
    });

program.parse(process.argv);