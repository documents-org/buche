import uuidv4 from 'uuid/v4';

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