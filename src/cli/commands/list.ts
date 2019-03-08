import {logger} from '../../logger';
import {StyleMap, visua} from '../../visua';

export const list = async (options) => {
    try {
        let styleMap: StyleMap = visua({
            path: options.parent.path,
            strict: options.parent.strict,
        });
        styleMap.print();
    } catch (e) {
        logger.error(e.formattedMessage || e.stack || e);
    }
    process.exit();
};
