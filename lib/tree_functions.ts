import { v4 as uuidv4 } from "uuid";
import { Block } from ".";

export const find_node = (node: Block, uuid: string) : Block | null => {
    if (node.uuid === uuid) {
        return node;
    }
    return ((node.children || []) as Block[]).reduce((out: null | Block, n: Block) => {
        if (out) return out;
        return find_node(n, uuid);
    }, null);
};

export const refresh_uuids = (node: Block) : Block => {
    return {
        ...node,
        uuid: uuidv4(),
        children: (node.children || []).map((n) => refresh_uuids(n)),
    };
};

export const insert_in_tree = (node: Block, to_insert: Block, destination_uuid: string) : Block => {
    if (node.uuid === destination_uuid) {
        return {
            ...node,
            children: [...(node.children || []), to_insert],
        };
    } else {
        return {
            ...node,
            children: (node.children || []).map((n) =>
                insert_in_tree(n, to_insert, destination_uuid)
            ),
        };
    }
};

export const remove_from_tree = (node: Block, uuid_to_remove: string) : Block => {
    return {
        ...node,
        children: node.children
            .filter((n) => n.uuid !== uuid_to_remove)
            .map((n) => remove_from_tree(n, uuid_to_remove)),
    };
};

export const teleport_in_tree = (node: Block, to_teleport: Block, destination_uuid: string) : Block => {
    const tree = insert_in_tree(
        node,
        refresh_uuids(to_teleport),
        destination_uuid
    );
    return remove_from_tree(tree, to_teleport.uuid);
};

export const performUpgrades = (node: Block) : Block => {
    const n = {...node};

    if (typeof n.cssClasses === "undefined") {
        n.cssClasses = "";
    }

    n.children = n.children.map(performUpgrades);

    return n;
};