<template>
  <div id="app">
    <buche
      :blocks="blocks"
      :node="tree"
      @update:node="tree = $event"></buche>
  </div>
</template>

<script>
// eslint-disable-next-line
import bulma from "bulma/css/bulma.min.css";
import Buche from './components/Buche.vue';
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
    Buche
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
  min-height: 100%;
  background: #666;
}

.Buche {
  margin: 2em;
}

.BucheNode_node-cols_2 > .BucheNode_children > .BucheBranch {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.BucheNode_node-cols_2 > .BucheNode_children > .BucheBranch > .BucheNode {
  flex: 0 0 calc(50% - 1em);
}
</style>