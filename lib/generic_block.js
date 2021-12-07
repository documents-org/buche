import { v4 as uuidv4 } from 'uuid';

export const generic_block = {
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