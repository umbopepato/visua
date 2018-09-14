import {StyleMap} from './cssom/style-map';

export abstract class Plugin {

    static get options(): {[key: string]: any} {
        return {};
    };

    abstract run(styleMap: StyleMap, options: {[key: string]: any});

}