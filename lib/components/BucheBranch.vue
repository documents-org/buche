<template>
  <div class="BucheBranch">
    <buche-node
      v-for="(node, index) in tNodes"
      :node="node"
      :depth="depth"
      :lang="lang"
      :index="index"
      :active_node="active_node"
      @active_node="$emit('active_node', $event)"
      :total="nodes.length"
      :copy_candidate="copy_candidate"
      :teleport_candidate="teleport_candidate"
      :path="[...path, (node).type]"
      :blocks="blocks"
      :inside_developed_block="inside_developed_block"
      :show_labels="show_labels"
      :can_destroy="can_destroy"
      @before="handle_before((node).uuid)"
      @after="handle_after((node).uuid)"
      @want_teleport="$emit('want_teleport', $event)"
      @destroy="handle_destroy((node).uuid)"
      @want_copy="$emit('want_copy', $event)"
      @teleport="$emit('teleport', $event)"
      @bucheCopy="$emit('bucheCopy', $event)"
      @update:node="updateBranch((node).uuid, $event)"
      :key="node.uuid"
    ></buche-node>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
// migration in progress.
import { Block } from "..";
import BucheNode from "./BucheNode.vue";

export default {
  name: "BucheBranch",
  computed: {
    tNodes() {
      return this.nodes as Block[];
    }
  },
  props: {
    lang: {
      type: String,
      default: "en",
    },
    inside_developed_block: {
      type: Boolean,
      required: false,
      default: false,
    },
    nodes: {
      type: Array,
      default: () => [],
    },
    show_labels: {
      type: Boolean,
      default: false,
    },
    active_node: {},
    copy_candidate: {},
    teleport_candidate: {},
    path: {
      type: Array,
      default: () => [],  
    },
    depth: {},
    blocks: {},
    can_destroy: {},
  },
  beforeCreate: function () {
    this.$options.components = { BucheNode };
  },
  methods: {
    handle_before(uuid: string) {
      const index = this.nodes.findIndex((n: Block) => n.uuid === uuid);
      if (index === 0 || !index) return;
      const nodes = [...this.nodes];
      const item = nodes.splice(index, 1)[0];
      nodes.splice(index - 1, 0, item);
      this.$emit("update:nodes", nodes);
    },
    handle_after(uuid: string) {
      const index = this.nodes.findIndex((n: Block) => n.uuid === uuid);
      if (index === this.nodes.length - 1 || (!index && index !== 0)) return;
      const nodes = [...this.nodes];
      const item = nodes.splice(index, 1)[0];
      nodes.splice(index + 1, 0, item);
      this.$emit("update:nodes", nodes);
    },
    handle_destroy(uuid: string) {
      this.$emit(
        "update:nodes",
        [...this.nodes].filter((a) => a.uuid !== uuid)
      );
    },
    updateBranch(uuid: string, node: Block) {
      this.$emit(
        "update:nodes",
        this.nodes.map((a: Block) => {
          return a.uuid === uuid ? node : a;
        })
      );
    },
  },
};
</script>

<style>
</style>
