<template>
  <button class="button is-rounded is-small is-xsmall" @click="$emit('update:folded', !folded)">
    <span class="icon is-small" v-if="folded">
      <svg style="width: 14px; height: 14px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
      </svg>
    </span>
    <span class="icon is-small" v-else>
      <svg style="width: 14px; height: 14px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
      </svg>
    </span>
  </button>
</template>

<script>
// @ts-nocheck
// migration in progress
export default {
  props: {
    folded: {},
  },
};
</script>

<style>

</style>