<!-- Binnode Input -->
<template>
    <div>
        <input ref="input" class="binnode-input" :style="{'width': width + 'px' }" :value="value"
            @input="$emit('input', $event.target.value)" @blur="$emit('blur')" @focus="onFocus">
        <span ref="widthIndicator"
            style="display: inline-block; visibility: hidden; position: absolute;">{{ value }}</span>
    </div>
</template>

<script>
    export default {
        props: ['value'],
        data: function () {
            return {
                width: 40
            }
        },
        methods: {
            forceFocus() {
                this.$refs.input.focus();
            },
            onFocus() {
                this.width = this.$refs.widthIndicator.offsetWidth;
            },
        },
        watch: {
            value() {
                process.nextTick(() => {
                    this.width = this.$refs.widthIndicator.offsetWidth;
                })
            }
        }
    }
</script>