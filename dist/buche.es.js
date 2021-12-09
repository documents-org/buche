var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { resolveComponent, openBlock, createElementBlock, Fragment, renderList, createBlock, normalizeClass, normalizeStyle, createElementVNode, withDirectives, toDisplayString, vShow, createCommentVNode, resolveDynamicComponent, createVNode, createTextVNode } from "vue";
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function validate(uuid) {
  return typeof uuid === "string" && REGEX.test(uuid);
}
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify(rnds);
}
const find_node = (node, uuid) => {
  if (node.uuid === uuid) {
    return node;
  }
  return (node.children || []).reduce((out, n) => {
    if (out)
      return out;
    return find_node(n, uuid);
  }, null);
};
const refresh_uuids = (node) => {
  return __spreadProps(__spreadValues({}, node), {
    uuid: v4(),
    children: (node.children || []).map((n) => refresh_uuids(n))
  });
};
const insert_in_tree = (node, to_insert, destination_uuid) => {
  if (node.uuid === destination_uuid) {
    return __spreadProps(__spreadValues({}, node), {
      children: [...node.children || [], to_insert]
    });
  } else {
    return __spreadProps(__spreadValues({}, node), {
      children: (node.children || []).map((n) => insert_in_tree(n, to_insert, destination_uuid))
    });
  }
};
const remove_from_tree = (node, uuid_to_remove) => {
  return __spreadProps(__spreadValues({}, node), {
    children: node.children.filter((n) => n.uuid !== uuid_to_remove).map((n) => remove_from_tree(n, uuid_to_remove))
  });
};
const teleport_in_tree = (node, to_teleport, destination_uuid) => {
  const tree = insert_in_tree(node, refresh_uuids(to_teleport), destination_uuid);
  return remove_from_tree(tree, to_teleport.uuid);
};
var _export_sfc = (sfc, props) => {
  for (const [key, val] of props) {
    sfc[key] = val;
  }
  return sfc;
};
const _sfc_main$2 = {
  name: "BucheBranch",
  props: {
    nodes: {
      type: Array,
      default: () => []
    },
    show_labels: {
      type: Boolean,
      default: false
    },
    copy_candidate: {},
    teleport_candidate: {},
    path: {},
    depth: {},
    blocks: {},
    can_destroy: {}
  },
  beforeCreate: function() {
    this.$options.components = { BucheNode };
  },
  methods: {
    handle_before(uuid) {
      const index = this.nodes.findIndex((n) => n.uuid === uuid);
      if (index === 0 || !index)
        return;
      const nodes = [...this.nodes];
      const item = nodes.splice(index, 1)[0];
      nodes.splice(index - 1, 0, item);
      this.$emit("update:nodes", nodes);
    },
    handle_after(uuid) {
      const index = this.nodes.findIndex((n) => n.uuid === uuid);
      if (index === this.nodes.length - 1 || !index && index !== 0)
        return;
      const nodes = [...this.nodes];
      const item = nodes.splice(index, 1)[0];
      nodes.splice(index + 1, 0, item);
      this.$emit("update:nodes", nodes);
    },
    handle_destroy(uuid) {
      this.$emit("update:nodes", [...this.nodes].filter((a) => a.uuid !== uuid));
    },
    updateBranch(uuid, node) {
      this.$emit("update:nodes", this.nodes.map((a) => {
        return a.uuid === uuid ? node : a;
      }));
    }
  }
};
const _hoisted_1$2 = { class: "BucheBranch" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_buche_node = resolveComponent("buche-node");
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.nodes, (node, index) => {
      return openBlock(), createBlock(_component_buche_node, {
        node,
        depth: $props.depth,
        index,
        total: $props.nodes.length,
        copy_candidate: $props.copy_candidate,
        teleport_candidate: $props.teleport_candidate,
        path: [...$props.path, node.type],
        blocks: $props.blocks,
        show_labels: $props.show_labels,
        can_destroy: $props.can_destroy,
        onBefore: ($event) => $options.handle_before(node.uuid),
        onAfter: ($event) => $options.handle_after(node.uuid),
        onWant_teleport: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("want_teleport", $event)),
        onDestroy: ($event) => $options.handle_destroy(node.uuid),
        onWant_copy: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("want_copy", $event)),
        onTeleport: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("teleport", $event)),
        onCopy: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("copy", $event)),
        "onUpdate:node": ($event) => $options.updateBranch(node.uuid, $event),
        key: node.uuid
      }, null, 8, ["node", "depth", "index", "total", "copy_candidate", "teleport_candidate", "path", "blocks", "show_labels", "can_destroy", "onBefore", "onAfter", "onDestroy", "onUpdate:node"]);
    }), 128))
  ]);
}
var BucheBranch = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
var BucheNode_vue_vue_type_style_index_0_lang = "";
const _sfc_main$1 = {
  components: { BucheBranch },
  name: "BucheNode",
  data() {
    return {
      show_actions: false,
      show_adders: false,
      folded: false
    };
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    show_labels: {
      type: Boolean,
      default: false
    },
    depth: {
      type: Number,
      default: 0
    },
    blocks: {
      type: Object,
      default: () => ({})
    },
    path: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number
    },
    total: {
      type: Number
    },
    copy_candidate: {},
    teleport_candidate: {},
    can_destroy: {
      type: Boolean,
      default: true
    },
    root: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    find_block(type) {
      return this.blocks[type];
    },
    update_nodes(payload) {
      this.$emit("update:node", __spreadProps(__spreadValues({}, this.node), {
        children: payload
      }));
    },
    add_child(block) {
      this.$emit("update:node", __spreadProps(__spreadValues({}, this.node), {
        children: [...this.node.children, block.constructor()]
      }));
      this.show_adders = false;
    }
  }
};
const _hoisted_1$1 = { class: "BucheNode_header" };
const _hoisted_2 = { style: { "display": "flex" } };
const _hoisted_3 = {
  key: 0,
  class: "icon is-small"
};
const _hoisted_4 = /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-chevron-up" }, null, -1);
const _hoisted_5 = [
  _hoisted_4
];
const _hoisted_6 = { key: 1 };
const _hoisted_7 = /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-chevron-up mdi-rotate-180" }, null, -1);
const _hoisted_8 = [
  _hoisted_7
];
const _hoisted_9 = /* @__PURE__ */ createTextVNode(" \xA0 ");
const _hoisted_10 = {
  key: 0,
  class: "BucheNode_actions buttons"
};
const _hoisted_11 = ["disabled"];
const _hoisted_12 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-arrow-up" })
], -1);
const _hoisted_13 = [
  _hoisted_12
];
const _hoisted_14 = ["disabled"];
const _hoisted_15 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-arrow-down" })
], -1);
const _hoisted_16 = [
  _hoisted_15
];
const _hoisted_17 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-content-copy" })
], -1);
const _hoisted_18 = [
  _hoisted_17
];
const _hoisted_19 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-target" })
], -1);
const _hoisted_20 = [
  _hoisted_19
];
const _hoisted_21 = ["disabled"];
const _hoisted_22 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-trash" })
], -1);
const _hoisted_23 = [
  _hoisted_22
];
const _hoisted_24 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-close" })
], -1);
const _hoisted_25 = [
  _hoisted_24
];
const _hoisted_26 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("i", { class: "mdi mdi-cog" })
], -1);
const _hoisted_27 = [
  _hoisted_26
];
const _hoisted_28 = {
  key: 0,
  class: "BucheNode_editor"
};
const _hoisted_29 = {
  key: 1,
  class: "BucheNode_children"
};
const _hoisted_30 = {
  key: 0,
  class: "BucheNode_children_empty"
};
const _hoisted_31 = {
  key: 1,
  class: "BucheNode_buttons_add_node",
  style: { "margin-top": "1em" }
};
const _hoisted_32 = {
  class: "buttons",
  style: { "margin-top": "1em" }
};
const _hoisted_33 = ["onClick"];
const _hoisted_34 = {
  key: 2,
  class: "BucheNode_tree_actions_buttons buttons"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_buche_branch = resolveComponent("buche-branch");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["BucheNode box", {
      [`BucheNode_node-${$props.node.type}`]: 1,
      "BucheNode--will_be_teleported": $props.teleport_candidate === $props.node.uuid,
      "BucheNode--will_be_copied": $props.copy_candidate === $props.node.uuid
    }]),
    style: normalizeStyle({ background: `rgba(0,0,0, ${0.03 * ($props.depth % 4)})` })
  }, [
    createElementVNode("div", _hoisted_1$1, [
      createElementVNode("div", _hoisted_2, [
        createElementVNode("button", {
          class: "button is-rounded is-small",
          onClick: _cache[0] || (_cache[0] = ($event) => $data.folded = !$data.folded)
        }, [
          $data.folded ? (openBlock(), createElementBlock("span", _hoisted_3, _hoisted_5)) : (openBlock(), createElementBlock("span", _hoisted_6, _hoisted_8))
        ]),
        _hoisted_9,
        withDirectives(createElementVNode("h3", { class: "BucheNode_title subtitle" }, toDisplayString($options.find_block($props.node.type).label), 513), [
          [vShow, $props.show_labels]
        ])
      ]),
      !$props.node.root ? withDirectives((openBlock(), createElementBlock("div", _hoisted_10, [
        withDirectives(createElementVNode("button", {
          class: "BucheNode_action_reorder_prev button is-small is-rounded",
          disabled: $props.index && $props.index === 0,
          onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("before", $props.node.uuid))
        }, _hoisted_13, 8, _hoisted_11), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createElementVNode("button", {
          class: "BucheNode_action_reorder_next button is-small is-rounded",
          disabled: $props.index && $props.index === $props.total - 1,
          onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("after", $props.node.uuid))
        }, _hoisted_16, 8, _hoisted_14), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createElementVNode("button", {
          class: normalizeClass(["BucheNode_action_reorder_copy button is-small is-rounded", $props.copy_candidate === $props.node.uuid ? "is-primary" : ""]),
          onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("copy", $props.node.uuid))
        }, _hoisted_18, 2), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createElementVNode("button", {
          class: normalizeClass(["BucheNode_action_reorder_teleport button is-small is-rounded", $props.teleport_candidate === $props.node.uuid ? "is-primary" : ""]),
          onClick: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("teleport", $props.node.uuid))
        }, _hoisted_20, 2), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createElementVNode("button", {
          class: "BucheNode_action_reorder_destroy button is-small is-rounded",
          disabled: !$props.can_destroy,
          onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("destroy"))
        }, _hoisted_23, 8, _hoisted_21), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createElementVNode("button", {
          onClick: _cache[6] || (_cache[6] = ($event) => $data.show_actions = 0),
          class: "BucheNode_action_hide_actions button is-small is-rounded"
        }, _hoisted_25, 512), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createElementVNode("button", {
          onClick: _cache[7] || (_cache[7] = ($event) => $data.show_actions = 1),
          class: "BucheNode_action_hide_actions button is-small is-rounded"
        }, _hoisted_27, 512), [
          [vShow, !$data.show_actions]
        ])
      ], 512)), [
        [vShow, !$data.folded]
      ]) : createCommentVNode("", true)
    ]),
    $props.node.type !== "generic" ? withDirectives((openBlock(), createElementBlock("div", _hoisted_28, [
      (openBlock(), createBlock(resolveDynamicComponent($options.find_block($props.node.type).editor), {
        value: $props.node.data,
        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => $props.node.data = $event)
      }, null, 8, ["value"]))
    ], 512)), [
      [vShow, !$data.folded]
    ]) : createCommentVNode("", true),
    $options.find_block($props.node.type).has_children ? withDirectives((openBlock(), createElementBlock("div", _hoisted_29, [
      $props.node.children.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_30, " No children yet. ")) : createCommentVNode("", true),
      createVNode(_component_buche_branch, {
        nodes: $props.node.children,
        path: [...$props.path, $props.node.type],
        blocks: $props.blocks,
        can_destroy: !$options.find_block($props.node.type).children_min || $options.find_block($props.node.type).children_min < $props.node.children.length,
        show_labels: $props.show_labels,
        depth: $props.depth + 1,
        onCopy: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("copy", $event)),
        onWant_teleport: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("want_teleport", $event)),
        onTeleport: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("teleport", $event)),
        onWant_copy: _cache[12] || (_cache[12] = ($event) => _ctx.$emit("want_copy", $event)),
        copy_candidate: $props.copy_candidate,
        teleport_candidate: $props.teleport_candidate,
        "onUpdate:nodes": $options.update_nodes
      }, null, 8, ["nodes", "path", "blocks", "can_destroy", "show_labels", "depth", "copy_candidate", "teleport_candidate", "onUpdate:nodes"]),
      !$options.find_block($props.node.type).children_max || $options.find_block($props.node.type).children_max > $props.node.children.length ? (openBlock(), createElementBlock("div", _hoisted_31, [
        createElementVNode("button", {
          class: "button is-small",
          onClick: _cache[13] || (_cache[13] = ($event) => $data.show_adders = !$data.show_adders)
        }, toDisplayString($data.show_adders ? "Close block list" : "Add a block"), 1),
        withDirectives(createElementVNode("div", _hoisted_32, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.blocks, (v, key) => {
            return openBlock(), createElementBlock("button", {
              class: normalizeClass(["button is-small", [
                `BucheNode_button_add_block`,
                `BucheNode_button_add_block-${v.type}`
              ]]),
              key,
              onClick: ($event) => $options.add_child(v)
            }, toDisplayString(v.label), 11, _hoisted_33);
          }), 128))
        ], 512), [
          [vShow, $data.show_adders]
        ])
      ])) : createCommentVNode("", true),
      $props.teleport_candidate && $props.teleport_candidate !== $props.node.uuid || $props.copy_candidate && $props.copy_candidate !== $props.node.uuid ? (openBlock(), createElementBlock("div", _hoisted_34, [
        $props.teleport_candidate && $props.teleport_candidate !== $props.node.uuid ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "button is-primary is-small",
          onClick: _cache[14] || (_cache[14] = ($event) => _ctx.$emit("want_teleport", this.node.uuid))
        }, " Teleport here. ")) : createCommentVNode("", true),
        $props.copy_candidate && $props.copy_candidate !== $props.node.uuid ? (openBlock(), createElementBlock("button", {
          key: 1,
          class: "button is-primary is-small",
          onClick: _cache[15] || (_cache[15] = ($event) => _ctx.$emit("want_copy", this.node.uuid))
        }, " Paste here. ")) : createCommentVNode("", true)
      ])) : createCommentVNode("", true)
    ], 512)), [
      [vShow, !$data.folded]
    ]) : createCommentVNode("", true)
  ], 6);
}
var BucheNode = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  name: "Buche",
  components: {
    BucheNode
  },
  props: {
    node: {},
    blocks: {},
    show_labels: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      root_teleport_candidate: null,
      root_copy_candidate: null
    };
  },
  methods: {
    trigger_teleport(to_uuid) {
      const source_uuid = this.root_teleport_candidate;
      const source_node = find_node(this.node, source_uuid);
      this.$emit("update:node", teleport_in_tree(this.node, source_node, to_uuid));
      this.root_teleport_candidate = null;
    },
    trigger_copy(to_uuid) {
      const source_uuid = this.root_copy_candidate;
      const source_node = find_node(this.node, source_uuid);
      const copy = refresh_uuids(source_node);
      this.$emit("update:node", insert_in_tree(this.node, copy, to_uuid));
      this.root_copy_candidate = null;
    }
  }
};
const _hoisted_1 = { class: "Buche box" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_buche_node = resolveComponent("buche-node");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.node ? (openBlock(), createBlock(_component_buche_node, {
      key: 0,
      depth: 0,
      index: 0,
      total: 1,
      root: true,
      onWant_teleport: $options.trigger_teleport,
      onWant_copy: $options.trigger_copy,
      onTeleport: _cache[0] || (_cache[0] = ($event) => $data.root_teleport_candidate = $event === $data.root_teleport_candidate ? null : $event),
      onCopy: _cache[1] || (_cache[1] = ($event) => $data.root_copy_candidate = $event === $data.root_copy_candidate ? null : $event),
      blocks: $props.blocks,
      path: [],
      show_labels: $props.show_labels,
      copy_candidate: $data.root_copy_candidate,
      teleport_candidate: $data.root_teleport_candidate,
      node: $props.node,
      "onUpdate:node": _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update:node", $event))
    }, null, 8, ["onWant_teleport", "onWant_copy", "blocks", "show_labels", "copy_candidate", "teleport_candidate", "node"])) : createCommentVNode("", true)
  ]);
}
var BucheComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const generic_block = {
  type: "generic",
  label: "Groupe",
  constructor: () => ({
    data: {},
    root: false,
    type: "generic",
    children: [],
    uuid: v4()
  }),
  children_min: 0,
  has_children: true
};
const root_node = () => __spreadProps(__spreadValues({}, generic_block.constructor()), {
  root: true
});
const Buche = BucheComponent;
export { Buche, BucheComponent as default, generic_block, root_node };
