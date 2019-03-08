<img src="logo.svg" width="150" height="150">

# Visua

A tool to describe brand design systems using standard CSS

> 🛠 This package is still in development: use carefully until 1.0 release

## Documentation

See [visua.io](https://visua.io/) for guidance and the full documentation.

## Install

Be sure to have a recent version of [node.js](https://nodejs.org) and [npm](https://npmjs.org) installed.

Depending on the execution environment of your project you may want to install Visua globally:

```bash
$ npm i -g visua
```

or locally as a dev dependency, (i.e. if it has to run in CI/CD pipelines):

```bash
$ npm i -D visua
```

## Identity files

The aim of Visua is to let you _describe_ the core of your brand's design system by using standard CSS files and then
use that as a source for automated themes/assets builds and more.

Identity files are nothing more than standard CSS files made of only variables, possibly combined:

```css
:root {
    --primary-color: #EFEFEF;
    --secondary-color: #4F4F4F;
    --font-family: 'Raleway', sans-serif;
    --headings-font-family: 'Montserrat', sans-serif;
    --spacer: 1.2em;
}
```

## Plugins

Visua exposes a small CLI to manage projects and run plugins: small tasks that take the parsed CSS as input and perform
operations such as building themes for mobile applications and websites.

To use a plugin install it using npm:

```bash
$ npm i visua-bootstrap
```

and run it with the CLI (from your project root folder):

```bash
$ visua run visua-bootstrap
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
