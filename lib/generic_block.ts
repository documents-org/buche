import { v4 as uuidv4 } from 'uuid';
import { BlockDescription } from '.';
export const generic_block : BlockDescription = {
    type: 'generic',
    label: 'Groupe',
    constructor: () => ({
        data: {},
        root: false,
        type: 'generic',
        children: [],
        uuid: uuidv4(),
    }),
    children_min: 0,
    has_children: true,
};

export const root_node = () => ({
    ...generic_block.constructor(),
    root: true,
})