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
import { resolveComponent, openBlock, createElementBlock, Fragment, renderList, createBlock, createElementVNode, toDisplayString, normalizeClass, withModifiers, normalizeStyle, createVNode, withDirectives, vShow, createCommentVNode, resolveDynamicComponent, createTextVNode } from "vue";
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
const _sfc_main$d = {
  name: "BucheBranch",
  props: {
    lang: {
      type: String,
      default: "en"
    },
    nodes: {
      type: Array,
      default: () => []
    },
    show_labels: {
      type: Boolean,
      default: false
    },
    active_node: {},
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
const _hoisted_1$d = { class: "BucheBranch" };
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_buche_node = resolveComponent("buche-node");
  return openBlock(), createElementBlock("div", _hoisted_1$d, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.nodes, (node, index) => {
      return openBlock(), createBlock(_component_buche_node, {
        node,
        depth: $props.depth,
        lang: $props.lang,
        index,
        active_node: $props.active_node,
        onActive_node: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("active_node", $event)),
        total: $props.nodes.length,
        copy_candidate: $props.copy_candidate,
        teleport_candidate: $props.teleport_candidate,
        path: [...$props.path, node.type],
        blocks: $props.blocks,
        show_labels: $props.show_labels,
        can_destroy: $props.can_destroy,
        onBefore: ($event) => $options.handle_before(node.uuid),
        onAfter: ($event) => $options.handle_after(node.uuid),
        onWant_teleport: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("want_teleport", $event)),
        onDestroy: ($event) => $options.handle_destroy(node.uuid),
        onWant_copy: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("want_copy", $event)),
        onTeleport: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("teleport", $event)),
        onCopy: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("copy", $event)),
        "onUpdate:node": ($event) => $options.updateBranch(node.uuid, $event),
        key: node.uuid
      }, null, 8, ["node", "depth", "lang", "index", "active_node", "total", "copy_candidate", "teleport_candidate", "path", "blocks", "show_labels", "can_destroy", "onBefore", "onAfter", "onDestroy", "onUpdate:node"]);
    }), 128))
  ]);
}
var BucheBranch = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d]]);
const _sfc_main$c = {
  props: {
    folded: {}
  }
};
const _hoisted_1$c = {
  key: 0,
  class: "icon is-small"
};
const _hoisted_2$b = /* @__PURE__ */ createElementVNode("svg", {
  style: { "width": "14px", "height": "14px" },
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ createElementVNode("path", {
    fill: "currentColor",
    d: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
  })
], -1);
const _hoisted_3$b = [
  _hoisted_2$b
];
const _hoisted_4$2 = {
  key: 1,
  class: "icon is-small"
};
const _hoisted_5$2 = /* @__PURE__ */ createElementVNode("svg", {
  style: { "width": "14px", "height": "14px" },
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ createElementVNode("path", {
    fill: "currentColor",
    d: "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
  })
], -1);
const _hoisted_6$2 = [
  _hoisted_5$2
];
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", {
    class: "button is-rounded is-small is-xsmall",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:folded", !$props.folded))
  }, [
    $props.folded ? (openBlock(), createElementBlock("span", _hoisted_1$c, _hoisted_3$b)) : (openBlock(), createElementBlock("span", _hoisted_4$2, _hoisted_6$2))
  ]);
}
var BucheFoldButton = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c]]);
const _sfc_main$b = {
  name: "BucheCopyButton"
};
const _hoisted_1$b = { class: "BucheNode_action_reorder_copy button is-small is-xsmall is-rounded" };
const _hoisted_2$a = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    })
  ])
], -1);
const _hoisted_3$a = [
  _hoisted_2$a
];
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$b, _hoisted_3$a);
}
var BucheCopyButton = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b]]);
const _sfc_main$a = {
  name: "BucheTeleportButton"
};
const _hoisted_1$a = { class: "BucheNode_action_reorder_teleport button is-small is-xsmall is-rounded" };
const _hoisted_2$9 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M19.22 4C19.5 4 19.75 4 19.96 4.05C20.13 5.44 19.94 8.3 16.66 11.58C14.96 13.29 12.93 14.6 10.65 15.47L8.5 13.37C9.42 11.06 10.73 9.03 12.42 7.34C15.18 4.58 17.64 4 19.22 4M19.22 2C17.24 2 14.24 2.69 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.62 17.27 10.13 17.5 10.66 17.5C10.89 17.5 11.13 17.44 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39S20.7 2 19.22 2M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z"
    })
  ])
], -1);
const _hoisted_3$9 = [
  _hoisted_2$9
];
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$a, _hoisted_3$9);
}
var BucheTeleportButton = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a]]);
const _sfc_main$9 = {
  name: "BucheDestroyButton"
};
const _hoisted_1$9 = { class: "BucheNode_action_reorder_destroy button is-small is-xsmall is-rounded" };
const _hoisted_2$8 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
    })
  ])
], -1);
const _hoisted_3$8 = [
  _hoisted_2$8
];
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$9, _hoisted_3$8);
}
var BucheDestroyButton = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
const _sfc_main$8 = {
  name: "BucheCloseActionsButton"
};
const _hoisted_1$8 = { class: "BucheNode_action_hide_actions button is-small is-xsmall is-rounded" };
const _hoisted_2$7 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
    })
  ])
], -1);
const _hoisted_3$7 = [
  _hoisted_2$7
];
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$8, _hoisted_3$7);
}
var BucheCloseActionsButton = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
const _sfc_main$7 = {};
const _hoisted_1$7 = { class: "BucheNode_action_reorder_prev button is-small is-xsmall is-rounded" };
const _hoisted_2$6 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"
    })
  ])
], -1);
const _hoisted_3$6 = [
  _hoisted_2$6
];
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$7, _hoisted_3$6);
}
var BucheReorderPrevButton = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const _sfc_main$6 = {};
const _hoisted_1$6 = { class: "BucheNode_action_reorder_next button is-small is-xsmall is-rounded" };
const _hoisted_2$5 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"
    })
  ])
], -1);
const _hoisted_3$5 = [
  _hoisted_2$5
];
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$6, _hoisted_3$5);
}
var BucheReorderNextButton = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = {};
const _hoisted_1$5 = { class: "BucheNode_action_hide_actions button is-small is-xsmall is-rounded" };
const _hoisted_2$4 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"
    })
  ])
], -1);
const _hoisted_3$4 = [
  _hoisted_2$4
];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$5, _hoisted_3$4);
}
var BucheOpenActionsButton = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const fr = {
  "No children yet.": "Pas encore de blocs !",
  "Add a block": "Ajouter un bloc",
  "Close block list": "Fermer la liste",
  "Teleport here.": "T\xE9l\xE9porter ici",
  "Paste here.": "Coller ici",
  "Edit this block": "\xC9diter ce bloc",
  "Close this block": "Fermer ce bloc"
};
const en = {};
const langs = {
  fr,
  en
};
const t_ = (string, lang) => {
  const l = langs[lang];
  if (!l)
    return string;
  const s = l[string];
  if (!s)
    return string;
  return s;
};
const _sfc_main$4 = {
  props: {
    show_adders: {},
    lang: {}
  },
  methods: {
    t_(str) {
      return t_(str, this.lang);
    }
  }
};
const _hoisted_1$4 = { class: "button is-small is-xsmall" };
const _hoisted_2$3 = {
  key: 0,
  class: "icon is-small"
};
const _hoisted_3$3 = /* @__PURE__ */ createElementVNode("svg", {
  style: { "width": "14px", "height": "14px" },
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ createElementVNode("path", {
    fill: "currentColor",
    d: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
  })
], -1);
const _hoisted_4$1 = [
  _hoisted_3$3
];
const _hoisted_5$1 = {
  key: 1,
  class: "icon is-small"
};
const _hoisted_6$1 = /* @__PURE__ */ createElementVNode("svg", {
  style: { "width": "14px", "height": "14px" },
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ createElementVNode("path", {
    fill: "currentColor",
    d: "M19,6H22V8H19V11H17V8H14V6H17V3H19V6M17,17V14H19V19H3V6H11V8H5V17H17Z"
  })
], -1);
const _hoisted_7$1 = [
  _hoisted_6$1
];
const _hoisted_8$1 = { style: { "margin-left": "0.25em" } };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$4, [
    $props.show_adders ? (openBlock(), createElementBlock("span", _hoisted_2$3, _hoisted_4$1)) : (openBlock(), createElementBlock("span", _hoisted_5$1, _hoisted_7$1)),
    createElementVNode("span", _hoisted_8$1, toDisplayString($props.show_adders ? $options.t_("Close block list") : $options.t_("Add a block")), 1)
  ]);
}
var BucheShowAddersButton = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = {
  props: { lang: {} },
  methods: {
    t_(s) {
      return t_(s, this.lang);
    }
  }
};
const _hoisted_1$3 = { class: "button is-primary is-small is-xsmall" };
const _hoisted_2$2 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M11,2V4.07C7.38,4.53 4.53,7.38 4.07,11H2V13H4.07C4.53,16.62 7.38,19.47 11,19.93V22H13V19.93C16.62,19.47 19.47,16.62 19.93,13H22V11H19.93C19.47,7.38 16.62,4.53 13,4.07V2M11,6.08V8H13V6.09C15.5,6.5 17.5,8.5 17.92,11H16V13H17.91C17.5,15.5 15.5,17.5 13,17.92V16H11V17.91C8.5,17.5 6.5,15.5 6.08,13H8V11H6.09C6.5,8.5 8.5,6.5 11,6.08M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11Z"
    })
  ])
], -1);
const _hoisted_3$2 = { style: { "margin-left": "0.25em" } };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$3, [
    _hoisted_2$2,
    createElementVNode("span", _hoisted_3$2, toDisplayString($options.t_("Teleport here.")), 1)
  ]);
}
var BucheReceiveTeleportButton = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  props: { lang: {} },
  methods: {
    t_(s) {
      return t_(s, this.lang);
    }
  }
};
const _hoisted_1$2 = { class: "button is-primary is-small is-xsmall" };
const _hoisted_2$1 = /* @__PURE__ */ createElementVNode("span", { class: "icon is-small" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    style: { "width": "14px", "height": "14px" },
    viewBox: "0 0 24 24"
  }, [
    /* @__PURE__ */ createElementVNode("path", {
      fill: "currentColor",
      d: "M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z"
    })
  ])
], -1);
const _hoisted_3$1 = { style: { "margin-left": "0.25em" } };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", _hoisted_1$2, [
    _hoisted_2$1,
    createElementVNode("span", _hoisted_3$1, toDisplayString($options.t_("Paste here.")), 1)
  ]);
}
var BucheReceiveCopyButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
var BucheNode_vue_vue_type_style_index_0_lang = "";
const _sfc_main$1 = {
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
      too_small: false,
      open_for_edition: false
    };
  },
  props: {
    lang: {
      type: String,
      default: "en"
    },
    active_node: {},
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
    t_(string) {
      return t_(string, this.lang);
    },
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
    },
    check_sizing() {
      const w = this.$el.getBoundingClientRect().width;
      this.too_small = w < 460;
    }
  },
  mounted() {
    setInterval(() => {
      if (this.open_for_edition)
        return;
      this.check_sizing();
    }, 300);
    window.addEventListener("resize", this.check_sizing);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.check_sizing);
  }
};
const _hoisted_1$1 = { class: "BucheNode_header" };
const _hoisted_2 = { style: { "display": "flex" } };
const _hoisted_3 = /* @__PURE__ */ createTextVNode(" \xA0 ");
const _hoisted_4 = {
  key: 0,
  class: "BucheNode_actions buttons"
};
const _hoisted_5 = {
  key: 0,
  class: "BucheNode_editor"
};
const _hoisted_6 = {
  key: 1,
  class: "BucheNode_children"
};
const _hoisted_7 = {
  key: 0,
  class: "BucheNode_children_empty"
};
const _hoisted_8 = {
  key: 1,
  class: "BucheNode_buttons_add_node",
  style: { "margin-top": "1em" }
};
const _hoisted_9 = { class: "buttons" };
const _hoisted_10 = {
  class: "buttons",
  style: { "margin-top": "1em" }
};
const _hoisted_11 = ["onClick"];
const _hoisted_12 = {
  key: 2,
  class: "BucheNode_tree_actions_buttons buttons"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_buche_fold_button = resolveComponent("buche-fold-button");
  const _component_buche_reorder_prev_button = resolveComponent("buche-reorder-prev-button");
  const _component_buche_reorder_next_button = resolveComponent("buche-reorder-next-button");
  const _component_buche_copy_button = resolveComponent("buche-copy-button");
  const _component_buche_teleport_button = resolveComponent("buche-teleport-button");
  const _component_buche_destroy_button = resolveComponent("buche-destroy-button");
  const _component_buche_close_actions_button = resolveComponent("buche-close-actions-button");
  const _component_buche_open_actions_button = resolveComponent("buche-open-actions-button");
  const _component_buche_branch = resolveComponent("buche-branch");
  const _component_buche_show_adders_button = resolveComponent("buche-show-adders-button");
  const _component_buche_receive_teleport_button = resolveComponent("buche-receive-teleport-button");
  const _component_buche_receive_copy_button = resolveComponent("buche-receive-copy-button");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["BucheNode box box-small", {
      "BucheNode--open_for_edition": $data.open_for_edition,
      [`BucheNode_node-${$props.node.type}`]: 1,
      "BucheNode--will_be_teleported": $props.teleport_candidate === $props.node.uuid,
      "BucheNode--will_be_copied": $props.copy_candidate === $props.node.uuid
    }]),
    onMousemove: _cache[19] || (_cache[19] = withModifiers(() => $props.active_node !== $props.node.uuid ? _ctx.$emit("active_node", $props.node.uuid) : 1, ["stop"])),
    style: normalizeStyle({
      background: `rgba(0,0,0, ${0.02 * ($props.depth % 4)})`,
      border: $props.active_node === $props.node.uuid ? "1px solid #0827a2" : "1px solid #aaa",
      boxShadow: $props.active_node === $props.node.uuid ? "0px 0px 5px rgba(24, 8, 85, 0.5)" : ""
    })
  }, [
    createElementVNode("div", _hoisted_1$1, [
      createElementVNode("div", _hoisted_2, [
        createVNode(_component_buche_fold_button, {
          folded: $data.folded,
          "onUpdate:folded": _cache[0] || (_cache[0] = ($event) => $data.folded = $event)
        }, null, 8, ["folded"]),
        _hoisted_3,
        withDirectives(createElementVNode("h3", { class: "BucheNode_title subtitle" }, toDisplayString($options.find_block($props.node.type).label), 513), [
          [vShow, $props.show_labels]
        ])
      ]),
      withDirectives(createElementVNode("div", null, [
        createElementVNode("button", {
          class: "button is-rounded is-small is-xsmall",
          onClick: _cache[1] || (_cache[1] = ($event) => $data.open_for_edition = !$data.open_for_edition)
        }, toDisplayString($options.t_("Edit this block")), 1)
      ], 512), [
        [vShow, $data.too_small && !$data.open_for_edition]
      ]),
      withDirectives(createElementVNode("div", null, [
        createElementVNode("button", {
          class: "button is-rounded is-small is-xsmall",
          onClick: _cache[2] || (_cache[2] = ($event) => $data.open_for_edition = !$data.open_for_edition)
        }, toDisplayString($options.t_("Close this block")), 1)
      ], 512), [
        [vShow, $data.open_for_edition]
      ]),
      !$props.node.root ? withDirectives((openBlock(), createElementBlock("div", _hoisted_4, [
        withDirectives(createVNode(_component_buche_reorder_prev_button, {
          disabled: $props.index && $props.index === 0,
          onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("before", $props.node.uuid))
        }, null, 8, ["disabled"]), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createVNode(_component_buche_reorder_next_button, {
          disabled: $props.index && $props.index === $props.total - 1,
          onClick: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("after", $props.node.uuid))
        }, null, 8, ["disabled"]), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createVNode(_component_buche_copy_button, {
          class: normalizeClass($props.copy_candidate === $props.node.uuid ? "is-primary" : ""),
          onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("copy", $props.node.uuid))
        }, null, 8, ["class"]), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createVNode(_component_buche_teleport_button, {
          class: normalizeClass($props.teleport_candidate === $props.node.uuid ? "is-primary" : ""),
          onClick: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("teleport", $props.node.uuid))
        }, null, 8, ["class"]), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createVNode(_component_buche_destroy_button, {
          disabled: !$props.can_destroy,
          onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("destroy"))
        }, null, 8, ["disabled"]), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createVNode(_component_buche_close_actions_button, {
          onClick: _cache[8] || (_cache[8] = ($event) => $data.show_actions = 0)
        }, null, 512), [
          [vShow, $data.show_actions]
        ]),
        withDirectives(createVNode(_component_buche_open_actions_button, {
          onClick: _cache[9] || (_cache[9] = ($event) => $data.show_actions = 1)
        }, null, 512), [
          [vShow, !$data.show_actions]
        ])
      ], 512)), [
        [vShow, !$data.too_small || $data.open_for_edition]
      ]) : createCommentVNode("", true)
    ]),
    !$data.too_small && $props.node.type !== "generic" ? withDirectives((openBlock(), createElementBlock("div", _hoisted_5, [
      (openBlock(), createBlock(resolveDynamicComponent($options.find_block($props.node.type).editor), {
        value: $props.node.data,
        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => $props.node.data = $event)
      }, null, 8, ["value"]))
    ], 512)), [
      [vShow, !$data.folded]
    ]) : createCommentVNode("", true),
    (!$data.folded && !$data.too_small || $data.open_for_edition) && $options.find_block($props.node.type).has_children ? withDirectives((openBlock(), createElementBlock("div", _hoisted_6, [
      $props.node.children.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_7, toDisplayString($options.t_("No children yet.")), 1)) : createCommentVNode("", true),
      createVNode(_component_buche_branch, {
        nodes: $props.node.children,
        path: [...$props.path, $props.node.type],
        blocks: $props.blocks,
        lang: $props.lang,
        can_destroy: !$options.find_block($props.node.type).children_min || $options.find_block($props.node.type).children_min < $props.node.children.length,
        active_node: $props.active_node,
        onActive_node: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("active_node", $event)),
        show_labels: $props.show_labels,
        depth: $props.depth + 1,
        onCopy: _cache[12] || (_cache[12] = ($event) => _ctx.$emit("copy", $event)),
        onWant_teleport: _cache[13] || (_cache[13] = ($event) => _ctx.$emit("want_teleport", $event)),
        onTeleport: _cache[14] || (_cache[14] = ($event) => _ctx.$emit("teleport", $event)),
        onWant_copy: _cache[15] || (_cache[15] = ($event) => _ctx.$emit("want_copy", $event)),
        copy_candidate: $props.copy_candidate,
        teleport_candidate: $props.teleport_candidate,
        "onUpdate:nodes": $options.update_nodes
      }, null, 8, ["nodes", "path", "blocks", "lang", "can_destroy", "active_node", "show_labels", "depth", "copy_candidate", "teleport_candidate", "onUpdate:nodes"]),
      !$options.find_block($props.node.type).children_max || $options.find_block($props.node.type).children_max > $props.node.children.length ? withDirectives((openBlock(), createElementBlock("div", _hoisted_8, [
        createElementVNode("div", _hoisted_9, [
          createVNode(_component_buche_show_adders_button, {
            lang: $props.lang,
            show_adders: $data.show_adders,
            onClick: _cache[16] || (_cache[16] = ($event) => $data.show_adders = !$data.show_adders)
          }, null, 8, ["lang", "show_adders"]),
          $props.teleport_candidate && $props.teleport_candidate !== $props.node.uuid ? (openBlock(), createBlock(_component_buche_receive_teleport_button, {
            key: 0,
            lang: $props.lang,
            onClick: _cache[17] || (_cache[17] = ($event) => _ctx.$emit("want_teleport", this.node.uuid))
          }, null, 8, ["lang"])) : createCommentVNode("", true),
          $props.copy_candidate && $props.copy_candidate !== $props.node.uuid ? (openBlock(), createBlock(_component_buche_receive_copy_button, {
            key: 1,
            lang: $props.lang,
            onClick: _cache[18] || (_cache[18] = ($event) => _ctx.$emit("want_copy", this.node.uuid))
          }, null, 8, ["lang"])) : createCommentVNode("", true)
        ]),
        withDirectives(createElementVNode("div", _hoisted_10, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.blocks, (v, key) => {
            return openBlock(), createElementBlock("button", {
              class: normalizeClass(["button is-small is-xsmall", [
                `BucheNode_button_add_block`,
                `BucheNode_button_add_block-${v.type}`
              ]]),
              key,
              onClick: ($event) => $options.add_child(v)
            }, toDisplayString(v.label), 11, _hoisted_11);
          }), 128))
        ], 512), [
          [vShow, $data.show_adders]
        ])
      ], 512)), [
        [vShow, !$data.too_small || $data.open_for_edition]
      ]) : createCommentVNode("", true),
      $props.teleport_candidate && $props.teleport_candidate !== $props.node.uuid || $props.copy_candidate && $props.copy_candidate !== $props.node.uuid ? (openBlock(), createElementBlock("div", _hoisted_12)) : createCommentVNode("", true)
    ], 512)), [
      [vShow, !$data.folded && !$data.too_small || $data.open_for_edition]
    ]) : createCommentVNode("", true)
  ], 38);
}
var BucheNode = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  name: "Buche",
  components: {
    BucheNode
  },
  props: {
    node: {},
    lang: {
      type: String,
      default: "en"
    },
    blocks: {},
    show_labels: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      root_teleport_candidate: null,
      root_copy_candidate: null,
      active_node: null
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
const _hoisted_1 = {
  class: "Buche",
  style: { "background": "white" }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_buche_node = resolveComponent("buche-node");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.node ? (openBlock(), createBlock(_component_buche_node, {
      key: 0,
      depth: 0,
      index: 0,
      active_node: $data.active_node,
      onActive_node: _cache[0] || (_cache[0] = ($event) => $data.active_node = $event),
      total: 1,
      lang: $props.lang,
      root: true,
      onWant_teleport: $options.trigger_teleport,
      onWant_copy: $options.trigger_copy,
      onTeleport: _cache[1] || (_cache[1] = ($event) => $data.root_teleport_candidate = $event === $data.root_teleport_candidate ? null : $event),
      onCopy: _cache[2] || (_cache[2] = ($event) => $data.root_copy_candidate = $event === $data.root_copy_candidate ? null : $event),
      blocks: $props.blocks,
      path: [],
      show_labels: $props.show_labels,
      copy_candidate: $data.root_copy_candidate,
      teleport_candidate: $data.root_teleport_candidate,
      node: $props.node,
      "onUpdate:node": _cache[3] || (_cache[3] = ($event) => _ctx.$emit("update:node", $event))
    }, null, 8, ["active_node", "lang", "onWant_teleport", "onWant_copy", "blocks", "show_labels", "copy_candidate", "teleport_candidate", "node"])) : createCommentVNode("", true)
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
