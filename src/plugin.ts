import {StyleMap} from './cssom/style-map';

export type ValueInitializer = (value: string) => any;
export type OptionsMap = {[key: string]: Function | ValueInitializer};

export abstract class Plugin {

    static get options(): OptionsMap {
        return {};
    };

    abstract run(styleMap: StyleMap, options: {[key: string]: any});

}