import readline from 'readline-promise';
import * as util from 'util';
import {exec} from 'child_process';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as path from 'path';

const asyncExec = util.promisify(exec);

const rlp = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const plugin = async () => {
    console.log('Creating a new empty visua plugin.');
    console.log('See https://visua.io/guide/writing-plugins#naming for guidance on visua plugins naming conventions.\n');

    let slug = await rlp.questionAsync('Enter the plugin slug: visua-');
    while (slug == null || slug.length === 0) {
        slug = await rlp.questionAsync('Please provide a non empty slug: visua-');
    }
    let displayName = await rlp.questionAsync('Enter display name: ');
    while (!displayName || !displayName.length) {
        displayName = await rlp.questionAsync('Please provide a non empty display name: ');
    }
    const description = await rlp.questionAsync('Enter a short description: ');
    const pluginDir = path.join(process.cwd(), `visua-${slug}`);
    console.log('Creating plugin directory');
    fs.mkdirSync(pluginDir);
    console.log('Cloining starter template');
    await asyncExec(`git clone https://github.com/umbopepato/visua-plugin-template ${pluginDir}`);
    console.log('Removing versioning');
    rimraf(path.join(pluginDir, '.git'), () =>
    console.log(`Project succesfully created in folder visua-${slug}`));
    process.exit();
};