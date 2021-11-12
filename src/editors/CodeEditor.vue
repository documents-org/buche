<template>
  <div>
            <label>Bloc code</label>
            <input :value="value.content" @input="$emit('update:value', {...value, content: $event.target.value})" />
        </div>
</template>

<script>
export default {
    name: 'CodeEditor',
    props: {
        value: {},
    },
}
</script>

<style>

</style>