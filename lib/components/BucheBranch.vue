<template>
  <div class="BucheBranch">
    <buche-node
      v-for="(node, index) in nodes"
      :node="node"
      :depth="depth"
      :index="index"
      :total="nodes.length"
      :copy_candidate="copy_candidate"
      :teleport_candidate="teleport_candidate"
      :path="[...path, node.type]"
      :blocks="blocks"
      :show_labels="show_labels"
      :can_destroy="can_destroy"
      @before="handle_before(node.uuid)"
      @after="handle_after(node.uuid)"
      @want_teleport="$emit('want_teleport', $event)"
      @destroy="handle_destroy(node.uuid)"
      @want_copy="$emit('want_copy', $event)"
      @teleport="$emit('teleport', $event)"
      @copy="$emit('copy', $event)"
      @update:node="updateBranch(node.uuid, $event)"
      :key="node.uuid"
    ></buche-node>
  </div>
</template>

<script>
import BucheNode from './BucheNode.vue'

export default {
  name: "BucheBranch",
  props: {
    nodes: {
      type: Array,
      default: () => [],
    },
    show_labels: {
      type: Boolean,
      default: false,
    },
    copy_candidate: {},
    teleport_candidate: {},
    path: {},
    depth: {},
    blocks: {},
    can_destroy: {},
  },
  beforeCreate: function () {
    this.$options.components = { BucheNode };
  },
  methods: {
    handle_before(uuid) {
      const index = this.nodes.findIndex((n) => n.uuid === uuid);
      if (index === 0 || !index) return;
      const nodes = [...this.nodes];
      const item = nodes.splice(index, 1)[0];
      nodes.splice(index - 1, 0, item);
      this.$emit("update:nodes", nodes);
    },
    handle_after(uuid) {
      const index = this.nodes.findIndex((n) => n.uuid === uuid);
      if (index === this.nodes.length - 1 || (!index && index !== 0)) return;
      const nodes = [...this.nodes];
      const item = nodes.splice(index, 1)[0];
      nodes.splice(index + 1, 0, item);
      this.$emit("update:nodes", nodes);
    },
    handle_destroy(uuid) {
      this.$emit(
        "update:nodes",
        [...this.nodes].filter((a) => a.uuid !== uuid)
      );
    },
    updateBranch(uuid, node) {
      this.$emit(
        "update:nodes",
        this.nodes.map((a) => {
          return a.uuid === uuid ? node : a;
        })
      );
    },
  },
};
</script>

<style>
</style>
