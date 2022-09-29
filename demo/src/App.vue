<template>
  <div id="app">
    <buche :blocks="blocks" :lang="'fr'" :node="tree" @update:node="tree = $event"></buche>
  </div>
</template>

<script lang="ts" setup>
import {Buche, generic_block} from 'buche'
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref, Ref } from 'vue';
import { blocks } from './blocks'

const tree = ref(generic_block.constructor());
onMounted(() => {
  tree.value = {
    root: true,
    type: 'generic',
    data: {},
    children: [
      {
        data: {},
        root: false,
        type: 'cols_2',
        children: [
          {
            root: true,
            type: 'generic',
            data: {},
            children: [
              {
                data: {},
                root: false,
                type: 'cols_2',
                children: [
                  {
                    root: true,
                    type: 'generic',
                    data: {},
                    uuid: uuidv4(),
                    children: [{
                      data: {
                        content: "",
                      },
                      root: false,
                      type: 'text',
                      children: [],
                      uuid: uuidv4(),
                    }, {
                      data: {
                        content: "",
                      },
                      root: false,
                      type: 'text',
                      children: [],
                      uuid: uuidv4(),
                    }],
                  },
                  {
                    root: true,
                    type: 'generic',
                    data: {},
                    uuid: uuidv4(),
                    children: [{
                      data: {
                        content: "",
                      },
                      root: false,
                      type: 'text',
                      children: [],
                      uuid: uuidv4(),
                    }, {
                      data: {
                        content: "",
                      },
                      root: false,
                      type: 'text',
                      children: [],
                      uuid: uuidv4(),
                    }],
                  },
                ],
                uuid: uuidv4(),
              }
            ],
            uuid: uuidv4()
          }, {
            root: true,
            type: 'generic',
            data: {},
            children: [
              {
                data: {},
                root: false,
                type: 'cols_2',
                children: [
                  blocks.generic.constructor(),
                  blocks.generic.constructor(),
                ],
                uuid: uuidv4(),
              }
            ],
            uuid: uuidv4()
          }
        ],
        uuid: uuidv4(),
      }
    ],
    uuid: uuidv4()
  };
});
</script>

<style>
html,
body {
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.2;
  min-height: 100%;
  background: #666;
}

.Buche {
  margin: 2em;
}

.BucheNode_node-cols_2>.BucheNode_children>.BucheBranch {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.BucheNode_node-cols_2>.BucheNode_children>.BucheBranch>.BucheNode {
  flex: 0 0 calc(50% - 1em);
}

.box.box-small {
  border-radius: 2px;
  padding: 0.65em;
}

.button.is-xsmall {
  height: 2em;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
