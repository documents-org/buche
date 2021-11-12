<template>
  <div>
        <label>Bloc texte</label>
        <input :value="value.content" @input="$emit('update:value', {...value, content: $event.target.value})" />
    </div>
</template>

<script>
export default {
    name: 'TextEditor',
    props: {
        value: {},
    },
}
</script>

<style>

</style>