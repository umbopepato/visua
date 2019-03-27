import readline from 'readline-promise';
import * as util from 'util';
import {exec} from 'child_process';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as path from 'path';
import chalk from 'chalk';
import {renderTemplateFile} from 'template-file';

const asyncExec = util.promisify(exec);

const rlp = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const plugin = async () => {
    console.log('Creating a new empty visua plugin.\n');

    let slug = await rlp.questionAsync(b('Choose a slug for your plugin: ') + 'visua-');
    while (slug == null || slug.length === 0) {
        slug = await rlp.questionAsync(b('Please provide a non empty slug: ') + 'visua-');
    }
    const pluginName = `visua-${slug}`;
    let displayName = await rlp.questionAsync(b('Choose a display name for your plugin: '));
    while (!displayName || !displayName.length) {
        displayName = await rlp.questionAsync(b('Please provide a non empty display name: '));
    }
    const description = await rlp.questionAsync(b('Enter a short description: '));
    const author = await rlp.questionAsync(b('Author: '));
    const repository = await rlp.questionAsync(b('Git repository: '));
    const pluginDir = path.join(process.cwd(), pluginName);
    console.log('Creating plugin directory');
    fs.mkdirSync(pluginDir);
    console.log('Cloning starter template');
    await asyncExec(`git clone https://github.com/umbopepato/visua-plugin-template --depth 1 ${pluginDir}`);
    console.log('Writing package.json');
    const packagePath = path.join(pluginDir, 'package.json');
    const pkg = require(packagePath);
    pkg.name = pluginName;
    pkg.description = description;
    pkg.author = author;
    pkg.repository = repository;
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 4));
    const readmePath = path.join(pluginDir, 'README.md');
    console.log('Writing README');
    fs.writeFileSync(readmePath, await renderTemplateFile(readmePath, {slug, pluginName, displayName, description}));
    console.log('Removing versioning\n');
    rimraf(path.join(pluginDir, '.git'), () => {
        console.log(`Project succesfully created in folder ${pluginName}!`);
        console.log('See https://visua.io/guide/writing-plugins to learn more about visua plugins development');
        process.exit();
    });
};

const b = (str: string) => chalk.hex('#11adff')(str);
