<template>
    <input class="input is-small" style="display: inline-block; width: 20ch; position: relative; top: -3px; border-radius: 16px; transform: scale(0.9)" v-model="v" />
</template>

<script lang="ts">
export default {
    name: "BucheCssField",
    props: {
        classes: {
            type: String,
            default: '',
        },
    },
    computed: {
        v: {
            get() {
                return this.classes;
            },
            set(v) {
                this.$emit('update:classes', v);
            }
        }
    }
};
</script>