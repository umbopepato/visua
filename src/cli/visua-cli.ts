#!/usr/bin/env node
import * as program from 'commander';
import {InitCommand} from './commands/init';

program
    .version('0.0.1')
    .alias('-v');

program.command('init')
    .alias('initialize')
    .action(() => {
        new InitCommand();
    });

program.parse(process.argv);