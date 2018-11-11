import {StyleMap} from './cssom/style-map';

export type OptionsMap = {[key: string]: Function};

export abstract class Plugin {

    static get options(): OptionsMap {
        return {};
    };

    abstract run(styleMap: StyleMap, options: {[key: string]: any});

}