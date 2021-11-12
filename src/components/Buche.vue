<template>
    <div class="Buche box">
  <buche-node
    v-if="node"
    :depth="0"
    :index="0"
    :total="1"
    :root="1"
    @want_teleport="trigger_teleport"
    @want_copy="trigger_copy"
    @teleport="
      root_teleport_candidate =
        $event === root_teleport_candidate ? null : $event
    "
    @copy="root_copy_candidate = $event === root_copy_candidate ? null : $event"
    :blocks="blocks"
    :path="[]"
    :copy_candidate="root_copy_candidate"
    :teleport_candidate="root_teleport_candidate"
    :node="node"
    @update:node="$emit('update:node', $event)"
  ></buche-node>
    </div>
</template>

<script>
import {
  teleport_in_tree,
  find_node,
  refresh_uuids,
  insert_in_tree,
} from "../tree_functions";
import BucheNode from "./BucheNode.vue";

export default {
  name: "Buche",
  components: {
    BucheNode,
  },
  props: {
    node: {},
    blocks: {},
  },
  data() {
    return {
      root_teleport_candidate: null,
      root_copy_candidate: null,
    };
  },
  methods: {
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
  },
};
</script>