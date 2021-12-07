import { v4 as uuidv4 } from "uuid";

export const find_node = (node, uuid) => {
    if (node.uuid === uuid) {
        return node;
    }
    return (node.children || []).reduce((out, n) => {
        if (out) return out;
        return find_node(n, uuid);
    }, null);
};

export const refresh_uuids = (node) => {
    return {
        ...node,
        uuid: uuidv4(),
        children: (node.children || []).map((n) => refresh_uuids(n)),
    };
};

export const insert_in_tree = (node, to_insert, destination_uuid) => {
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

export const remove_from_tree = (node, uuid_to_remove) => {
    return {
        ...node,
        children: node.children
            .filter((n) => n.uuid !== uuid_to_remove)
            .map((n) => remove_from_tree(n, uuid_to_remove)),
    };
};

export const teleport_in_tree = (node, to_teleport, destination_uuid) => {
    const tree = insert_in_tree(
        node,
        refresh_uuids(to_teleport),
        destination_uuid
    );
    return remove_from_tree(tree, to_teleport.uuid);
};