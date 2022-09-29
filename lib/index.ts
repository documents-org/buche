export interface Block {
    data: Record<string, any>,
    root: boolean,
    type: string,
    cssClasses?: string,
    children: Block[],
    uuid: string,
}

export type BlockConstructorFunction = () => Block;

export interface BlockDescription {
    type: string,
    label: string,
    constructor: BlockConstructorFunction,
    editor?: string,
    has_children: boolean,
    children_min?: number
    children_max?: number
}