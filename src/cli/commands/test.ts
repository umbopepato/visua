import {loadStyles} from '../load-styles';
import {logger} from '../../logger';

export const test = async () => {
    try {
        let styleMap = await loadStyles();
        styleMap.print();
    } catch (e) {
        logger.error(e);
    }
};