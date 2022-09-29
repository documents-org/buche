import { Block, BlockDescription } from "..";
declare const _default: {
    components: {
        BucheBranch: {
            name: string;
            computed: {
                tNodes(): Block[];
            };
            props: {
                lang: {
                    type: StringConstructor;
                    default: string;
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
        BucheFoldButton: any;
        BucheReorderNextButton: any;
        BucheReorderPrevButton: any;
        BucheCopyButton: any;
        BucheTeleportButton: any;
        BucheDestroyButton: any;
        BucheOpenActionsButton: any;
        BucheCloseActionsButton: any;
        BucheShowAddersButton: any;
        BucheReceiveTeleportButton: any;
        BucheReceiveCopyButton: any;
        BucheCssButton: any;
        BucheCssField: {
            name: string;
            props: {
                classes: {
                    type: StringConstructor;
                    default: string;
                };
            };
            computed: {
                v: {
                    get(): any;
                    set(v: any): void;
                };
            };
        };
    };
    name: string;
    data(): {
        show_actions: boolean;
        show_adders: boolean;
        folded: boolean;
        too_small: boolean;
        open_for_edition: boolean;
        editing_css: boolean;
    };
    computed: {
        tNode(): Block;
    };
    props: {
        lang: {
            type: StringConstructor;
            default: string;
        };
        active_node: {};
        node: {
            type: ObjectConstructor;
            required: boolean;
        };
        show_labels: {
            type: BooleanConstructor;
            default: boolean;
        };
        depth: {
            type: NumberConstructor;
            default: number;
        };
        blocks: {
            type: ObjectConstructor;
            default: () => {};
        };
        path: {
            type: ArrayConstructor;
            default: () => any[];
        };
        index: {
            type: NumberConstructor;
        };
        total: {
            type: NumberConstructor;
        };
        copy_candidate: {};
        teleport_candidate: {};
        can_destroy: {
            type: BooleanConstructor;
            default: boolean;
        };
        root: {
            type: BooleanConstructor;
            default: boolean;
        };
    };
    methods: {
        updateClasses(value: any): void;
        t_(string: string): string;
        find_block(type: string): BlockDescription;
        update_nodes(payload: Block[]): void;
        add_child(block: BlockDescription): void;
        check_sizing(): void;
    };
    mounted(): void;
    beforeDestroy(): void;
};
export default _default;
