<img src="logo.png" width="150" height="150">

# Visua

A tool to describe brand design systems using standard CSS

> 🛠 This package is still in development: use carefully until a 1.0 release.  
> Feedback and contributions are welcome!

## Documentation

See [visua.io](https://visua.io/) for guidance and the full documentation.

## Identity files

Visua is built around the concept of **identity files**: CSS files used as a "config" to store all the characteristics
of a brand identity in the form of CSS variables. Something like this:

```css
:root {
    --primary-color: #EFEFEF;
    --secondary-color: #4F4F4F;
    --font-family: 'Raleway', sans-serif;
    --headings-font-family: 'Montserrat', sans-serif;
    --spacer: 1.2em;
}
```

The package itself consists of a set of tools to work with this type of files, from parsing them to running code
generation tasks.

#### Install

If you want to use visua API in your node project, install it as a normal dependency:

```bash
$ npm i visua
```

and use it in your module:

```typescript
import {visua} from 'visua';

const styleMap = visua({
    path: 'identity/'
});
```

If you plan to use it to only run code generation plugins, consider installing it as a devDependency:

```bash
$ npm i -D visua
```

#### Running plugins

Plugins are small tasks run by the CLI to perform operations on the parsed identity files such as generating themes
and assets. `visua-bootstrap` is a basic plugin that maps a set of common variables to bootstrap scss variables and
creates for you a `variables.scss` file that you can later use to build your [themed bootstrap](https://getbootstrap.com/docs/4.0/getting-started/theming).

Install it by running:

```bash
$ npm i -D visua-bootstrap

# Visua plugins are npm packages whose names start with visua-
```

Now run the plugin (be sure to be in the same directory where `identity.css` is, otherwise `cd` there):

```bash
$ npx visua run bootstrap
```

## Credits

`templatel` and `template` string literal tags are modified versions of [dedent](https://github.com/dmnd/dedent) by
Desmond Brand (more in [LICENSE](LICENSE)).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
