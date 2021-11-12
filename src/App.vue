<template>
  <div id="app">
    <buche-node
      :blocks="blocks"
      :path="[]"
      v-if="tree"
      :node="tree"
      @update:node="tree = $event"></buche-node>
  </div>
</template>

<script>
import BucheNode from './components/BucheNode.vue';
import uuidv4 from "uuid/v4";
import { blocks } from "./blocks";

export default {
  name: 'App',
  data() {
    return {
      tree: null,
      blocks,
    };
  },
  components: {
    BucheNode
  },
  mounted() {
    if (!this.tree) {
      this.tree = {
        root: true,
        type: 'generic',
        data: {},
        children: [],
        uuid: uuidv4(),
      }
    }
  }
}
</script>

<style>
html, body {
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.2;
}

h1, h2, h3, h4, h5, h6, p, ul, li {
  margin-top: 0;
}

button {
  margin: 2px;
}
.uuid {
  font-size: 0.8em;
  font-weight: 400;
  display: inline-block;
  margin-left: auto;
  color: #333;
}

.buchenode_children {
  padding: 4px;
  background: white;
  margin: 4px;
}
</style>