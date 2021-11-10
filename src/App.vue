<template>
  <div id="app">
    <buche-node v-if="tree" :node="tree" @update:node="tree = $event"></buche-node>
  </div>
</template>

<script>
import BucheNode from './components/BucheNode.vue';
import uuidv4 from "uuid/v4";
import { sample_text } from './sample_text';

export default {
  name: 'App',
  data() {
    return {
      tree: null,
    };
  },
  components: {
    BucheNode
  },
  mounted() {
    if (!this.tree) {
      this.tree = {
        root: true,
        type: 'root',
        data: sample_text(),
        children: [],
        uuid: uuidv4(),
      }
    }
  }
}
</script>