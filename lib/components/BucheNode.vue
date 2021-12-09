<template>
  <div
    class="BucheNode box"
    :style="{ background: `rgba(0,0,0, ${0.03 * (depth % 4)})` }"
    :class="{
      [`BucheNode_node-${node.type}`]: 1,
      'BucheNode--will_be_teleported': teleport_candidate === node.uuid,
      'BucheNode--will_be_copied': copy_candidate === node.uuid,
    }"
  >
    <div class="BucheNode_header">
      <div style="display: flex">
        <button class="button is-rounded is-small" @click="folded = !folded">
          <span class="icon is-small" v-if="folded">
            <i class="mdi mdi-chevron-up"></i>
          </span>
          <span v-else>
            <i class="mdi mdi-chevron-up mdi-rotate-180"></i>
          </span>
        </button>
        &nbsp;
        <h3 class="BucheNode_title subtitle" v-show="show_labels">
          {{ find_block(node.type).label }}
        </h3>
      </div>
      <div v-show="!folded" class="BucheNode_actions buttons" v-if="!node.root">
        <button
          class="BucheNode_action_reorder_prev button is-small is-rounded"
          v-show="show_actions"
          :disabled="index && index === 0"
          @click="$emit('before', node.uuid)"
        >
          <span class="icon is-small">
            <i class="mdi mdi-arrow-up"></i>
          </span>
        </button>
        <button
          class="BucheNode_action_reorder_next button is-small is-rounded"
          v-show="show_actions"
          :disabled="index && index === total - 1"
          @click="$emit('after', node.uuid)"
        >
          <span class="icon is-small">
            <i class="mdi mdi-arrow-down"></i>
          </span>
        </button>
        <button
          class="BucheNode_action_reorder_copy button is-small is-rounded"
          v-show="show_actions"
          :class="copy_candidate === node.uuid ? 'is-primary' : ''"
          @click="$emit('copy', node.uuid)"
        >
          <span class="icon is-small">
            <i class="mdi mdi-content-copy"></i>
          </span>
        </button>
        <button
          class="BucheNode_action_reorder_teleport button is-small is-rounded"
          v-show="show_actions"
          :class="teleport_candidate === node.uuid ? 'is-primary' : ''"
          @click="$emit('teleport', node.uuid)"
        >
          <span class="icon is-small">
            <i class="mdi mdi-target"></i>
          </span>
        </button>
        <button
          class="BucheNode_action_reorder_destroy button is-small is-rounded"
          v-show="show_actions"
          :disabled="!can_destroy"
          @click="$emit('destroy')"
        >
          <span class="icon is-small">
            <i class="mdi mdi-trash"></i>
          </span>
        </button>
        <button
          v-show="show_actions"
          @click="show_actions = 0"
          class="BucheNode_action_hide_actions button is-small is-rounded"
        >
          <span class="icon is-small">
            <i class="mdi mdi-close"></i>
          </span>
        </button>
        <button
          v-show="!show_actions"
          @click="show_actions = 1"
          class="BucheNode_action_hide_actions button is-small is-rounded"
        >
          <span class="icon is-small">
            <i class="mdi mdi-cog"></i>
          </span>
        </button>
      </div>
    </div>

    <div
      class="BucheNode_editor"
      v-show="!folded"
      v-if="node.type !== 'generic'"
    >
      <component
        :is="find_block(node.type).editor"
        :value="node.data"
        @update:value="node.data = $event"
      ></component>
    </div>

    <div
      class="BucheNode_children"
      v-show="!folded"
      v-if="find_block(node.type).has_children"
    >
      <div class="BucheNode_children_empty" v-if="node.children.length === 0">
        No children yet.
      </div>

      <buche-branch
        :nodes="node.children"
        :path="[...path, node.type]"
        :blocks="blocks"
        :can_destroy="
          !find_block(node.type).children_min ||
          find_block(node.type).children_min < node.children.length
        "
        :show_labels="show_labels"
        :depth="depth + 1"
        @copy="$emit('copy', $event)"
        @want_teleport="$emit('want_teleport', $event)"
        @teleport="$emit('teleport', $event)"
        @want_copy="$emit('want_copy', $event)"
        :copy_candidate="copy_candidate"
        :teleport_candidate="teleport_candidate"
        @update:nodes="update_nodes"
      ></buche-branch>

      <div
        class="BucheNode_buttons_add_node"
        style="margin-top: 1em"
        v-if="
          !find_block(node.type).children_max ||
          find_block(node.type).children_max > node.children.length
        "
      >
        
        <button class="button is-small" @click="show_adders = !show_adders">
          {{ show_adders ? "Close block list" : "Add a block" }}
        </button>
        <div class="buttons" v-show="show_adders" style="margin-top: 1em;">
          <button
            class="button is-small"
            :class="[
              `BucheNode_button_add_block`,
              `BucheNode_button_add_block-${v.type}`,
            ]"
            v-for="(v, key) in blocks"
            :key="key"
            @click="add_child(v)"
          >
            {{ v.label }}
          </button>
        </div>
      </div>
      <div class="BucheNode_tree_actions_buttons buttons" v-if="teleport_candidate && teleport_candidate !== node.uuid || copy_candidate && copy_candidate !== node.uuid">
        <button
          class="button is-primary is-small"
          v-if="teleport_candidate && teleport_candidate !== node.uuid"
          @click="$emit('want_teleport', this.node.uuid)"
        >
          Teleport here.
        </button>
        <button
          class="button is-primary is-small"
          v-if="copy_candidate && copy_candidate !== node.uuid"
          @click="$emit('want_copy', this.node.uuid)"
        >
          Paste here.
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BucheBranch from "./BucheBranch.vue";

// TODO fix: eslint error about mutating prop node
export default {
  components: { BucheBranch },
  name: "BucheNode",
  data() {
    return {
      show_actions: false,
      show_adders: false,
      folded: false,
    };
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    show_labels: {
      type: Boolean,
      default: false,
    },
    depth: {
      type: Number,
      default: 0,
    },
    blocks: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
    },
    total: {
      type: Number,
    },
    copy_candidate: {},
    teleport_candidate: {},
    can_destroy: {
      type: Boolean,
      default: true,
    },
    root: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    find_block(type) {
      return this.blocks[type];
    },
    update_nodes(payload) {
      this.$emit("update:node", {
        ...this.node,
        children: payload,
      });
    },
    add_child(block) {
      this.$emit("update:node", {
        ...this.node,
        children: [...this.node.children, block.constructor()],
      });
      this.show_adders = false;
    },
  },
};
</script>

<style>
.BucheNode {
  margin-bottom: 2em;
}
.BucheNode_header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.BucheNode_children {
  margin: 1em 0;
}
</style>
