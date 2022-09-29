import { generic_block } from "buche";
import { v4 as uuidv4 } from "uuid";
import { BlockDescription } from 'buche';

export const blocks : Record<string, BlockDescription> = {
    text: {
        type: 'text',
        label: 'Bloc texte',
        constructor: () => ({
            data: {
                content: "",
            },
            root: false,
            type: 'text',
            children: [],
            uuid: uuidv4(),
        }),
        editor: 'TextEditor',
        has_children: false,
    },
    code: {
        type: 'code',
        label: 'Bloc code',
        constructor: () => ({
            data: {
                content: "",
            },
            root: false,
            type: 'code',
            children: [],
            uuid: uuidv4(),
        }),
        editor: 'CodeEditor',
        has_children: false,
    },
    generic: generic_block,
    cols_2: {
        type: 'cols_2',
        label: 'Deux colonnes',
        constructor: () => ({
            data: {},
            root: false,
            type: 'cols_2',
            children: [
                blocks.generic.constructor(),
                blocks.generic.constructor(),
            ],
            uuid: uuidv4(),
        }),
        children_min: 2,
        children_max: 2,
        has_children: true,
    },
};