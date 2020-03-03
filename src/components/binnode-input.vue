<template>
    <input class="binnode-input" :style="{'width': width + 'px'}" :value="value"
        v-on:input="$emit('input', $event.target.value)">
</template>

<script>
    module.export = {
        data: function () {
            return {
                width: 40
            }
        },
        props: ['value'],
        methods: {
        },
        watch: {
            value() {
                this.width = this.value.toString().length * 16;
            }
        }
    }
</script>

<style scoped>
    .binnode-input {
        min-width: var(--normal-inner-w);
        height: var(--normal-inner-h);
        border: none;
        outline: none;
        text-align: center;
        line-height: var(--normal-inner-h);
        font-size: var(--normal-font-size);
    }
</style>