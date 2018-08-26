import {StyleMap} from '../cssom/style-map';
import {visua} from '../visua';

export const loadStyles = (): Promise<StyleMap> => {
    return visua(`${process.cwd()}/identity.css`);
};