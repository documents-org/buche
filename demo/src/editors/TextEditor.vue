<template>
  <div>
    <label>Bloc texte</label>
    <input v-model="v" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
  value: String
});
const emit = defineEmits(['update:value']);

const v = computed(() => ({
  get() {
    return props.value;
  },
  set(v: string) {
    emit('update:value', v);    
  }
}));
</script>

<style>

</style>
