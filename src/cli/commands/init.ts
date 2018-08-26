import chalk from 'chalk';

export class InitCommand {

    constructor() {
        this.printLogoArt();
    }

    private printLogoArt() {
        console.log(chalk.hex('#2574ff')('         ((((((((((((((('));
        console.log(chalk.hex('#237bff')('     #(((((((((((((((((((((#'));
        console.log(chalk.hex('#2182ff')('   ((((((((((((((((((((((((((('));
        console.log(chalk.hex('#1d89ff')('  (((((((((((((((((((((((((((((        __      ___'));
        console.log(chalk.hex('#1b90ff')(' (((((((((((((((((((((((((((((((       \\ \\    / (_)'));
        console.log(chalk.hex('#1997ff')('((((((((((((((((') + chalk.white('@@@@@@@@@') + chalk.hex('#1997ff')('((((((((       \\ \\  / / _ ___ _   _  __ _'));
        console.log(chalk.hex('#13a6ff')('//////////////') + chalk.white('@@@@@@@@@@@@@') + chalk.hex('#13a6ff')('//////        \\ \\/ / | / __| | | |/ _` |'));
        console.log(chalk.hex('#11adff')('/////////////') + chalk.white('@@@@@@@@@@@@@@@') + chalk.hex('#11adff')('/////         \\  /  | \\__ \\ |_| | (_| |'));
        console.log(chalk.hex('#0eb4ff')('/////////////') + chalk.white('@@@@@@@@@@@@@@@') + chalk.hex('#0eb4ff')('/////          \\/   |_|___/\\__,_|\\__,_|'));
        console.log(chalk.hex('#09c3ff')('/////////////') + chalk.white('@@@@@@@@@@@@@@@') + chalk.hex('#09c3ff')('/////'));
        console.log(chalk.hex('#06caff')(' /////////////') + chalk.white('@@@@@@@@@@@@@') + chalk.hex('#06caff')('/////'));
        console.log(chalk.hex('#04d1ff')('  //////////////') + chalk.white('@@@@@@@@@') + chalk.hex('#04d1ff')('//////'));
        console.log(chalk.hex('#01d8ff')('   ///////////////////////////'));
        console.log(chalk.hex('#01d8ff')('      /////////////////////'));
    }

}