<template>
  <div
    class="BucheNode box box-small"
    @mousemove.stop="() => active_node !== node.uuid ? $emit('active_node', node.uuid) : 1"
    :style="{
      background: `rgba(0,0,0, ${0.02 * (depth % 4)})`,
      border: active_node === node.uuid ? '1px solid #0827a2' : '1px solid #aaa',
      boxShadow: active_node === node.uuid ? '0px 0px 5px rgba(24, 8, 85, 0.5)' : '', 
    }"
    :class="{
      'BucheNode--open_for_edition': open_for_edition,
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
      <div v-show="too_small && !open_for_edition">
       <button
          class="button is-rounded is-small is-xsmall"
          @click="open_for_edition = !open_for_edition"
        >  {{ t_("Edit this block") }}</button>
      </div>
      <div v-show="open_for_edition">
       <button
          class="button is-rounded is-small is-xsmall"
          @click="open_for_edition = !open_for_edition"
        >  {{ t_("Close this block") }}</button>
      </div>
      <div v-show="!too_small || open_for_edition" class="BucheNode_actions buttons" v-if="!node.root">
        <buche-css-field v-if="editing_css" :classes="node.cssClasses || ''" @update:classes="updateClasses"></buche-css-field>
        <buche-css-button
          v-show="show_actions"
          :editing="editing_css"
          @update:editcss="editing_css = $event">
        </buche-css-button>
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
          @click="show_actions = false"
        ></buche-close-actions-button>
        <buche-open-actions-button
          v-show="!show_actions"
          @click="show_actions = true"
        ></buche-open-actions-button>
        
      </div>
    </div>


    <div
      class="BucheNode_editor"
      v-show="!folded"
      v-if="!too_small && node.type !== 'generic'"
    >
      <component
        :is="find_block(node.type).editor"
        :value="node.data"
        @update:value="node.data = $event"
      ></component>
    </div>

    <div
      class="BucheNode_children"
      v-show="(!folded && !too_small) || open_for_edition"
      v-if="((!folded && !too_small) || open_for_edition) && find_block(node.type).has_children"
    >
      <div class="BucheNode_children_empty" v-if="node.children.length === 0">
        {{ t_("No children yet.") }}
      </div>

      <buche-branch
        :nodes="tNode.children"
        :path="[...path, tNode.type]"
        :blocks="blocks"
        :lang="lang"
        :can_destroy="
          !find_block(tNode.type).children_min ||
          (find_block(tNode.type).children_min ?? 0) < node.children.length
        "
        :active_node="active_node"
        @active_node="$emit('active_node', $event)"
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
        v-show="!too_small || open_for_edition"
        v-if="
          !find_block(tNode.type).children_max ||
          (find_block(tNode.type).children_max ?? 999) > tNode.children.length
        "
      >
        <div class="buttons">
          <buche-show-adders-button
            :lang="lang"
            :show_adders="show_adders"
            @click="show_adders = !show_adders"></buche-show-adders-button>
          <buche-receive-teleport-button  :lang="lang" v-if="teleport_candidate && teleport_candidate !== node.uuid"
            @click="$emit('want_teleport', tNode.uuid)"></buche-receive-teleport-button>
          <buche-receive-copy-button 
            :lang="lang" v-if="copy_candidate && copy_candidate !== node.uuid"
            @click="$emit('want_copy', tNode.uuid)"></buche-receive-copy-button>
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

<script lang="ts">
// @ts-nocheck
// migration in progress
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
import { Block, BlockDescription } from "..";
import BucheCssButton from "./controls/BucheCssButton.vue";
import BucheCssField from "./controls/BucheCssField.vue";

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
    BucheReceiveCopyButton,
    BucheCssButton,
    BucheCssField
},
  name: "BucheNode",
  data() {
    return {
      show_actions: false,
      show_adders: false,
      folded: false,
      too_small: false,
      open_for_edition: false,
      editing_css: false,
    };
  },
  computed: {
    tNode() {
      return this.node as Block;
    }
  },
  props: {
    lang: {
      type: String,
      default: "en",
    },
    active_node: {},
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
    updateClasses(value) {
      this.$emit('update:node', {...this.node, cssClasses: value});
    },
    t_(string: string) {
      return t_(string, this.lang);
    },
    find_block(type: string) : BlockDescription {
      return this.blocks[type];
    },
    update_nodes(payload: Block[]) {
      this.$emit("update:node", {
        ...this.node,
        children: payload,
      });
    },
    add_child(block: BlockDescription) {
      this.$emit("update:node", {
        ...this.node,
        children: [...this.node.children, block.constructor()],
      });
      this.show_adders = false;
    },
    check_sizing() {
      const w = this.$el.getBoundingClientRect().width;
      this.too_small = w < 460;
    },
  },
  mounted() {
    setInterval(() => {
      if (this.open_for_edition) return;
      this.check_sizing();
    }, 300);
    window.addEventListener('resize', this.check_sizing);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.check_sizing);
  }
};
</script>

<style>
.BucheNode {
  margin-bottom: 2em;
  position: relative;
}
.BucheNode--open_for_edition {
    position: fixed;
    width: 100%;
    max-width: 1280px;
    min-height: 600px;
    max-height: 90vh;
    overflow-y: scroll;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white!important;
    z-index: 99;
}
.BucheNode--open_for_edition .box {
  height: 100%;
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
.BucheNode_title.subtitle {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.25;
    position: relative;
    top: 0.4em;
    left: 0.4em;
}
</style>
