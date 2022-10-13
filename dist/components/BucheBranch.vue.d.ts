import { Block } from "..";
declare const _default: {
    name: string;
    computed: {
        tNodes(): Block[];
    };
    props: {
        lang: {
            type: StringConstructor;
            default: string;
        };
        inside_developed_block: {
            type: BooleanConstructor;
            required: boolean;
            default: boolean;
        };
        nodes: {
            type: ArrayConstructor;
            default: () => any[];
        };
        show_labels: {
            type: BooleanConstructor;
            default: boolean;
        };
        active_node: {};
        copy_candidate: {};
        teleport_candidate: {};
        path: {
            type: ArrayConstructor;
            default: () => any[];
        };
        depth: {};
        blocks: {};
        can_destroy: {};
    };
    beforeCreate: () => void;
    methods: {
        handle_before(uuid: string): void;
        handle_after(uuid: string): void;
        handle_destroy(uuid: string): void;
        updateBranch(uuid: string, node: Block): void;
    };
};
export default _default;
