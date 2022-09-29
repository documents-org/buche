import { BlockDescription } from '.';
export declare const generic_block: BlockDescription;
export declare const root_node: () => {
    root: boolean;
    data: Record<string, any>;
    type: string;
    cssClasses?: string;
    children: import(".").Block[];
    uuid: string;
};
