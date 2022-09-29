import { Block } from ".";
export declare const find_node: (node: Block, uuid: string) => Block | null;
export declare const refresh_uuids: (node: Block) => Block;
export declare const insert_in_tree: (node: Block, to_insert: Block, destination_uuid: string) => Block;
export declare const remove_from_tree: (node: Block, uuid_to_remove: string) => Block;
export declare const teleport_in_tree: (node: Block, to_teleport: Block, destination_uuid: string) => Block;
export declare const performUpgrades: (node: Block) => Block;
