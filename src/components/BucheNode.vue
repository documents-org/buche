<template>
  <div class="BucheNode">
      <h3><span v-if="node.root">Root</span>  Node {{ node.uuid }}</h3>
      <p>{{ node.data }}</p>
      <h4 v-if="teleport_candidate === node.uuid">Ready for teleportation !</h4>
      <h4 v-if="copy_candidate === node.uuid">Ready for copy !</h4>
      <div v-if="!node.root">
        <button :disabled="index && index === 0" @click="$emit('before', node.uuid)">move before</button>
        <button :disabled="index && index === total - 1" @click="$emit('after', node.uuid)">move after</button>
        <button @click="$emit('copy', node.uuid)">copy</button>
        <button @click="$emit('teleport', node.uuid)">select for teleportation</button>
        <button @click="$emit('destroy')">delete</button>
      </div>
      <div v-if="node.children">
          <h4>Children</h4>
          <div v-if="node.children.length === 0">No children yet.</div>
          <div v-else>
              <buche-branch
                :nodes="node.children"
                @copy="copy"
                @want_teleport="handle_want_teleport"
                @teleport="teleport"
                @want_copy="handle_want_copy"
                :copy_candidate="is_root ? root_copy_candidate : copy_candidate"
                :teleport_candidate="is_root ? root_teleport_candidate : teleport_candidate"
                @update:nodes="update_nodes"></buche-branch>
          </div>
          <button @click="add_child">Add a child node</button>
          <div v-if="teleport_candidate && teleport_candidate !== node.uuid">
              <button @click="want_teleport">Receive teleport candidate !</button>
          </div>
          <div v-if="copy_candidate">
              <button @click="want_copy" >Receive copy candidate !</button>
          </div>
      </div>
  </div>
</template>

<script>
import uuidv4 from "uuid/v4";
import BucheBranch from './BucheBranch.vue';

const find_node = (node, uuid) => {
    if (node.uuid === uuid) {
        return node;
    }
    return (node.children || []).reduce((out, n) => {
        if (out) return out;
        return find_node(n, uuid);
    }, null);
};

const refresh_uuids = (node) => {
    return {
        ...node,
        uuid: uuidv4(),
        children: (node.children || []).map(n => refresh_uuids(n)),
    };
};

const insert_in_tree = (node, to_insert, destination_uuid) => {
    if (node.uuid === destination_uuid) {
        return {
            ...node,
            children: [...(node.children || []), to_insert],
        };
    } else {
        return {
            ...node,
            children: (node.children || [])
                .map(n => insert_in_tree(n, to_insert, destination_uuid)),
        };
    }
};

const remove_from_tree = (node, uuid_to_remove) => {
    return {
       ...node,
       children: node.children
        .filter(n => n.uuid !== uuid_to_remove)
        .map(n => remove_from_tree(n, uuid_to_remove)),
    };
};

const teleport_in_tree = (node, to_teleport, destination_uuid) => {
    const tree = insert_in_tree(node, refresh_uuids(to_teleport), destination_uuid);
    return remove_from_tree(tree, to_teleport.uuid);
};

import {sample_text} from "./../sample_text";

export default {
  components: { BucheBranch },
    name: 'BucheNode',
    data() {
        return {
            root_teleport_candidate: null,
            root_copy_candidate: null,
        };
    },
    props: {
        node: {},
        index: {},
        total: {},
        copy_candidate: {},
        teleport_candidate: {}
    },
    computed: {
        is_root() {
            return !!this.node.root;
        },
    },
    methods: {
        trigger_teleport(to_uuid) {
            const source_uuid = this.root_teleport_candidate;
            const source_node = find_node(this.node, source_uuid);
            this.$emit('update:node', teleport_in_tree(this.node, source_node, to_uuid));
            this.root_teleport_candidate = null;
        },
        trigger_copy(to_uuid) {
            console.log(this.is_root);
            const source_uuid = this.root_copy_candidate;
            const source_node = find_node(this.node, source_uuid);
            const copy = refresh_uuids(source_node);
            this.$emit('update:node', insert_in_tree(this.node, copy, to_uuid));
            this.root_copy_candidate = null;
        },
        handle_want_teleport($event) {
            if (this.is_root) {
                this.trigger_teleport($event);
            } else {
                this.$emit('want_teleport', $event);
            }
        },
        want_teleport() {
            if (this.is_root) {
                this.trigger_teleport(this.node.uuid);
            } else {
                this.$emit('want_teleport', this.node.uuid);
            }
        },
        handle_want_copy($event) {
            if (this.is_root) {
                this.trigger_copy($event);
            } else {
                this.$emit('want_copy', $event);
            }
        },
        want_copy() {
            if (this.is_root) {
                this.trigger_copy(this.node.uuid);
            } else {
                this.$emit('want_copy', this.node.uuid);
            }
        },
        copy(uuid) {
            if (this.is_root) {
                this.root_copy_candidate = uuid;
            } else {
                this.$emit('copy', uuid);
            }
        },
        teleport(uuid) {
            if (this.is_root) {
                this.root_teleport_candidate = uuid;
            } else {
                this.$emit('teleport', uuid);
            }
        },
        update_nodes(payload) {
            this.$emit('update:node', {
                ...this.node,
                children: payload
            });
        },
        add_child() {
            this.$emit('update:node', {
                ...this.node,
                children: [
                    ...this.node.children,
                    {
                        root: false,
                        type: 'generic',
                        children: [],
                        data: sample_text(),
                        uuid: uuidv4(),
                    }
                ]
            });
        },
    },
};
</script>

<style>
.BucheNode {
    background: rgba(0,0,255,0.05);
    padding: 0.5em;
    border: 1px solid #ddd;
    margin: 4px;
}
</style>