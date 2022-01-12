<template>
  <div
    class="BucheNode box box-small"
    :style="{ background: `rgba(0,0,0, ${0.03 * (depth % 4)})` }"
    :class="{
      [`BucheNode_node-${node.type}`]: 1,
      'BucheNode--will_be_teleported': teleport_candidate === node.uuid,
      'BucheNode--will_be_copied': copy_candidate === node.uuid,
    }"
  >
    <div class="BucheNode_header">
      <div style="display: flex">
        <buche-fold-button
          :folded="folded"
          @update:folded="folded = $event"
        ></buche-fold-button>
        &nbsp;
        <h3 class="BucheNode_title subtitle" v-show="show_labels">
          {{ find_block(node.type).label }}
        </h3>
      </div>
      <div v-show="!folded" class="BucheNode_actions buttons" v-if="!node.root">
        <buche-reorder-prev-button
          v-show="show_actions"
          :disabled="index && index === 0"
          @click="$emit('before', node.uuid)"
        ></buche-reorder-prev-button>
        <buche-reorder-next-button
          v-show="show_actions"
          :disabled="index && index === total - 1"
          @click="$emit('after', node.uuid)"
        ></buche-reorder-next-button>
        <buche-copy-button
          v-show="show_actions"
          :class="copy_candidate === node.uuid ? 'is-primary' : ''"
          @click="$emit('copy', node.uuid)"
        ></buche-copy-button>
        <buche-teleport-button
          v-show="show_actions"
          :class="teleport_candidate === node.uuid ? 'is-primary' : ''"
          @click="$emit('teleport', node.uuid)"
        ></buche-teleport-button>
        <buche-destroy-button
          v-show="show_actions"
          :disabled="!can_destroy"
          @click="$emit('destroy')"
        ></buche-destroy-button>
        <buche-close-actions-button
          v-show="show_actions"
          @click="show_actions = 0"
        ></buche-close-actions-button>
        <buche-open-actions-button
          v-show="!show_actions"
          @click="show_actions = 1"
        ></buche-open-actions-button>
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
        {{ t_("No children yet.") }}
      </div>

      <buche-branch
        :nodes="node.children"
        :path="[...path, node.type]"
        :blocks="blocks"
        :lang="lang"
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
        <div class="buttons">
          <buche-show-adders-button :lang="lang" :show_adders="show_adders" @click="show_adders = !show_adders"></buche-show-adders-button>
          <buche-receive-teleport-button  :lang="lang" v-if="teleport_candidate && teleport_candidate !== node.uuid"
            @click="$emit('want_teleport', this.node.uuid)"></buche-receive-teleport-button>
         
          <buche-receive-copy-button 
            :lang="lang" v-if="copy_candidate && copy_candidate !== node.uuid"
            @click="$emit('want_copy', this.node.uuid)"></buche-receive-copy-button>
        </div>
        <div class="buttons" v-show="show_adders" style="margin-top: 1em">
          <button
            class="button is-small is-xsmall"
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
      <div
        class="BucheNode_tree_actions_buttons buttons"
        v-if="
          (teleport_candidate && teleport_candidate !== node.uuid) ||
          (copy_candidate && copy_candidate !== node.uuid)
        "
      ></div>
    </div>
  </div>
</template>

<script>
import BucheBranch from "./BucheBranch.vue";
import BucheFoldButton from "./controls/BucheFoldButton.vue";
import BucheCopyButton from "./controls/BucheCopyButton.vue";
import BucheTeleportButton from "./controls/BucheTeleportButton.vue";
import BucheDestroyButton from "./controls/BucheDestroyButton.vue";
import BucheCloseActionsButton from "./controls/BucheCloseActionsButton.vue";
import BucheReorderPrevButton from "./controls/BucheReorderPrevButton.vue";
import BucheReorderNextButton from "./controls/BucheReorderNextButton.vue";
import BucheOpenActionsButton from "./controls/BucheOpenActionsButton.vue";
import BucheShowAddersButton from "./controls/BucheShowAddersButton.vue";
import BucheReceiveTeleportButton from "./controls/BucheReceiveTeleportButton.vue"
import { t_ } from "./../lang/index";
import BucheReceiveCopyButton from './controls/BucheReceiveCopyButton.vue';

// TODO fix: eslint error about mutating prop node
export default {
  components: {
    BucheBranch,
    BucheFoldButton,
    BucheReorderNextButton,
    BucheReorderPrevButton,
    BucheCopyButton,
    BucheTeleportButton,
    BucheDestroyButton,
    BucheOpenActionsButton,
    BucheCloseActionsButton,
    BucheShowAddersButton,
    BucheReceiveTeleportButton,
    BucheReceiveCopyButton
  },
  name: "BucheNode",
  data() {
    return {
      show_actions: false,
      show_adders: false,
      folded: false,
    };
  },
  props: {
    lang: {
      type: String,
      default: "en",
    },
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
    t_(string) {
      return t_(string, this.lang);
    },
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
  margin-bottom: .5em;
}
.BucheNode_children {
  margin: 1em 0;
}
</style>
