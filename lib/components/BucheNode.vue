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

        <button
          class="BucheNode_action_reorder_copy button is-small is-rounded"
          v-show="show_actions"
          :class="copy_candidate === node.uuid ? 'is-primary' : ''"
          @click="$emit('copy', node.uuid)"
        >
          <span class="icon is-small">
            <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
              />
            </svg>
          </span>
        </button>
        <button
          class="BucheNode_action_reorder_teleport button is-small is-rounded"
          v-show="show_actions"
          :class="teleport_candidate === node.uuid ? 'is-primary' : ''"
          @click="$emit('teleport', node.uuid)"
        >
          <span class="icon is-small">
            <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M19.22 4C19.5 4 19.75 4 19.96 4.05C20.13 5.44 19.94 8.3 16.66 11.58C14.96 13.29 12.93 14.6 10.65 15.47L8.5 13.37C9.42 11.06 10.73 9.03 12.42 7.34C15.18 4.58 17.64 4 19.22 4M19.22 2C17.24 2 14.24 2.69 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.62 17.27 10.13 17.5 10.66 17.5C10.89 17.5 11.13 17.44 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39S20.7 2 19.22 2M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z"
              />
            </svg>
          </span>
        </button>
        <button
          class="BucheNode_action_reorder_destroy button is-small is-rounded"
          v-show="show_actions"
          :disabled="!can_destroy"
          @click="$emit('destroy')"
        >
          <span class="icon is-small">
            <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
              />
            </svg>
          </span>
        </button>
        <button
          v-show="show_actions"
          @click="show_actions = 0"
          class="BucheNode_action_hide_actions button is-small is-rounded"
        >
          <span class="icon is-small">
            <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </span>
        </button>
        <button
          v-show="!show_actions"
          @click="show_actions = 1"
          class="BucheNode_action_hide_actions button is-small is-rounded"
        >
          <span class="icon is-small">
            <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"
              />
            </svg>
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
          <button class="button is-small" @click="show_adders = !show_adders">
            <span class="icon is-small" v-if="show_adders">
              <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                />
              </svg>
            </span>
            <span class="icon is-small" v-else>
              <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19,6H22V8H19V11H17V8H14V6H17V3H19V6M17,17V14H19V19H3V6H11V8H5V17H17Z"
                />
              </svg>
            </span>
            <span style="margin-left: 0.25em">
              {{ show_adders ? t_("Close block list") : t_("Add a block") }}
            </span>
          </button>
          <button
            class="button is-primary is-small"
            v-if="teleport_candidate && teleport_candidate !== node.uuid"
            @click="$emit('want_teleport', this.node.uuid)"
          >
            <span class="icon is-small">
              <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M11,2V4.07C7.38,4.53 4.53,7.38 4.07,11H2V13H4.07C4.53,16.62 7.38,19.47 11,19.93V22H13V19.93C16.62,19.47 19.47,16.62 19.93,13H22V11H19.93C19.47,7.38 16.62,4.53 13,4.07V2M11,6.08V8H13V6.09C15.5,6.5 17.5,8.5 17.92,11H16V13H17.91C17.5,15.5 15.5,17.5 13,17.92V16H11V17.91C8.5,17.5 6.5,15.5 6.08,13H8V11H6.09C6.5,8.5 8.5,6.5 11,6.08M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11Z"
                />
              </svg>
            </span>
            <span style="margin-left: 0.25em"> {{ t_("Teleport here.") }}</span>
          </button>
          <button
            class="button is-primary is-small"
            v-if="copy_candidate && copy_candidate !== node.uuid"
            @click="$emit('want_copy', this.node.uuid)"
          >
            <span class="icon is-small">
              <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z"
                /></svg
            ></span>
            <span style="margin-left: 0.25em">{{ t_("Paste here.") }}</span>
          </button>
        </div>
        <div class="buttons" v-show="show_adders" style="margin-top: 1em">
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

import { t_ } from "./../lang/index";
import BucheReorderPrevButton from "./controls/BucheReorderPrevButton.vue";
import BucheReorderNextButton from "./controls/BucheReorderNextButton.vue";

// TODO fix: eslint error about mutating prop node
export default {
  components: {
    BucheBranch,
    BucheFoldButton,
    BucheReorderNextButton,
    BucheReorderPrevButton,
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
}
.BucheNode_children {
  margin: 1em 0;
}
</style>
