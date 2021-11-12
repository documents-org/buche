<template>
  <div
    class="BucheNode box"
    :class="{
      [`BucheNode_node-${node.type}`]: 1,
      'BucheNode--will_be_teleported': teleport_candidate === node.uuid,
      'BucheNode--will_be_copied': copy_candidate === node.uuid,
    }"
  >
    <h3 class="BucheNode_title subtitle">
      <span class="BucheNode_type">{{ find_block(node.type).label }}</span>
      <div class="BucheNode_actions buttons" v-if="!node.root">
        <button
          class="BucheNode_action_reorder_prev button is-small"
          :disabled="index && index === 0"
          @click="$emit('before', node.uuid)"
        >
          move before
        </button>
        <button
          class="BucheNode_action_reorder_next button is-small"
          :disabled="index && index === total - 1"
          @click="$emit('after', node.uuid)"
        >
          move after
        </button>
        <button
          class="BucheNode_action_reorder_copy button is-small"
          :class="copy_candidate === node.uuid ? 'is-primary' : ''"
          @click="$emit('copy', node.uuid)"
        >
          copy
        </button>
        <button
          class="BucheNode_action_reorder_teleport button is-small"
          :class="teleport_candidate === node.uuid ? 'is-primary' : ''"
          @click="$emit('teleport', node.uuid)"
        >
          select for teleportation
        </button>
        <button
          class="BucheNode_action_reorder_destroy button is-small"
          :disabled="!can_destroy"
          @click="$emit('destroy')"
        >
          delete
        </button>
      </div>
    </h3>

    <div class="BucheNode_editor" v-if="node.type !== 'generic'">
      <component
        :is="find_block(node.type).editor"
        :value="node.data"
        @update:value="node.data = $event"
      ></component>
    </div>

    <div class="BucheNode_children" v-if="find_block(node.type).has_children">
      <div class="BucheNode_children_empty" v-if="node.children.length === 0">
        No children yet.
      </div>
      <div v-else>
        <buche-branch
          :nodes="node.children"
          :path="[...path, node.type]"
          :blocks="blocks"
          :can_destroy="
            !find_block(node.type).children_min ||
            find_block(node.type).children_min < node.children.length
          "
          @copy="copy"
          @want_teleport="handle_want_teleport"
          @teleport="teleport"
          @want_copy="handle_want_copy"
          :copy_candidate="is_root ? root_copy_candidate : copy_candidate"
          :teleport_candidate="
            is_root ? root_teleport_candidate : teleport_candidate
          "
          @update:nodes="update_nodes"
        ></buche-branch>
      </div>
      <div
        class="BucheNode_buttons_add_node buttons"
        v-if="
          !find_block(node.type).children_max ||
          find_block(node.type).children_max > node.children.length
        "
      >
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
          + {{ v.label }}
        </button>
      </div>
      <div class="BucheNode_tree_actions_buttons buttons">
        <button
          class="button is-primary is-small"
          v-if="teleport_candidate && teleport_candidate !== node.uuid"
          @click="want_teleport"
        >
          Teleport here.
        </button>
        <button
            class="button is-primary is-small"
            v-if="copy_candidate && copy_candidate !== node.uuid"
            @click="want_copy">
          Paste here.
        </button>
      </div>
    </div>
    <span class="BucheNode_uuid is-size-7">{{ node.uuid.slice(0, 8) }}</span>
  </div>
</template>

<script>
import uuidv4 from "uuid/v4";
import BucheBranch from "./BucheBranch.vue";

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
    children: (node.children || []).map((n) => refresh_uuids(n)),
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
      children: (node.children || []).map((n) =>
        insert_in_tree(n, to_insert, destination_uuid)
      ),
    };
  }
};

const remove_from_tree = (node, uuid_to_remove) => {
  return {
    ...node,
    children: node.children
      .filter((n) => n.uuid !== uuid_to_remove)
      .map((n) => remove_from_tree(n, uuid_to_remove)),
  };
};

const teleport_in_tree = (node, to_teleport, destination_uuid) => {
  const tree = insert_in_tree(
    node,
    refresh_uuids(to_teleport),
    destination_uuid
  );
  return remove_from_tree(tree, to_teleport.uuid);
};

export default {
  components: { BucheBranch },
  name: "BucheNode",
  data() {
    return {
      root_teleport_candidate: null,
      root_copy_candidate: null,
    };
  },
  props: {
    node: {},
    blocks: {},
    path: {},
    index: {},
    total: {},
    copy_candidate: {},
    teleport_candidate: {},
    can_destroy: {},
  },
  computed: {
    is_root() {
      return !!this.node.root;
    },
  },
  methods: {
    find_block(type) {
      return this.blocks[type];
    },
    trigger_teleport(to_uuid) {
      const source_uuid = this.root_teleport_candidate;
      const source_node = find_node(this.node, source_uuid);
      this.$emit(
        "update:node",
        teleport_in_tree(this.node, source_node, to_uuid)
      );
      this.root_teleport_candidate = null;
    },
    trigger_copy(to_uuid) {
      const source_uuid = this.root_copy_candidate;
      const source_node = find_node(this.node, source_uuid);
      const copy = refresh_uuids(source_node);
      this.$emit("update:node", insert_in_tree(this.node, copy, to_uuid));
      this.root_copy_candidate = null;
    },
    handle_want_teleport($event) {
      if (this.is_root) {
        this.trigger_teleport($event);
      } else {
        this.$emit("want_teleport", $event);
      }
    },
    want_teleport() {
      if (this.is_root) {
        this.trigger_teleport(this.node.uuid);
      } else {
        this.$emit("want_teleport", this.node.uuid);
      }
    },
    handle_want_copy($event) {
      if (this.is_root) {
        this.trigger_copy($event);
      } else {
        this.$emit("want_copy", $event);
      }
    },
    want_copy() {
      if (this.is_root) {
        this.trigger_copy(this.node.uuid);
      } else {
        this.$emit("want_copy", this.node.uuid);
      }
    },
    copy(uuid) {
      if (this.is_root) {
        this.root_copy_candidate = uuid === this.root_copy_candidate ? null : uuid;
      } else {
        this.$emit("copy", uuid);
      }
    },
    teleport(uuid) {
      if (this.is_root) {
        this.root_teleport_candidate = uuid === this.root_teleport_candidate ? null : uuid;
      } else {
        this.$emit("teleport", uuid);
      }
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
    },
  },
};
</script>

<style>
.BucheNode_title {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
</style>