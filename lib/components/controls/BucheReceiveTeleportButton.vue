<template>
  <button class="button is-primary is-small is-xsmall">
    <span class="icon is-small">
      <svg style="width: 14px; height: 14px" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M11,2V4.07C7.38,4.53 4.53,7.38 4.07,11H2V13H4.07C4.53,16.62 7.38,19.47 11,19.93V22H13V19.93C16.62,19.47 19.47,16.62 19.93,13H22V11H19.93C19.47,7.38 16.62,4.53 13,4.07V2M11,6.08V8H13V6.09C15.5,6.5 17.5,8.5 17.92,11H16V13H17.91C17.5,15.5 15.5,17.5 13,17.92V16H11V17.91C8.5,17.5 6.5,15.5 6.08,13H8V11H6.09C6.5,8.5 8.5,6.5 11,6.08M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11Z" />
      </svg>
    </span>
    <span style="margin-left: 0.25em"> {{ t_("Teleport here.") }}</span>
  </button>
</template>

<script>
// @ts-nocheck
// migration in progress
import { t_ } from "./../../lang";

export default {
  props: { lang: {} },
  methods: {
    t_(s) {
      return t_(s, this.lang);
    },
  },
};
</script>

<style>

</style>