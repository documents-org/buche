<template>
  <button class="button is-small is-xsmall">
    <span class="icon is-small" v-if="show_adders">
      <svg style="width: 14px; height: 14px" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
      </svg>
    </span>
    <span class="icon is-small" v-else>
      <svg style="width: 14px; height: 14px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19,6H22V8H19V11H17V8H14V6H17V3H19V6M17,17V14H19V19H3V6H11V8H5V17H17Z" />
      </svg>
    </span>
    <span style="margin-left: 0.25em">
      {{ show_adders ? t_("Close block list") : t_("Add a block") }}
    </span>
  </button>
</template>

<script>
import { t_ } from "./../../lang/index";

export default {
  props: {
    show_adders: {},
    lang: {},
  },
  methods: {
    t_(str) {
      return t_(str, this.lang);
    }
  }
}
</script>

<style>

</style>