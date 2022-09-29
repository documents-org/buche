<template>
  <button class="button is-rounded is-small is-xsmall" @click="$emit('update:editcss', !editing)">
    <span class="icon is-small" v-if="!editing">
      C
    </span>
    <span class="icon is-small" v-else>
      X
    </span>
  </button>
</template>

<script>
  // @ts-nocheck
// migration in progress
export default {
  props: {
    editing: {},
  },
};
</script>

<style>

</style>