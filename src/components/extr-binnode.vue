<!-- External BinNode -->
<template>
    <div class="binnode extr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}" @click="divOnClick">
        <binnode-input ref="input" v-show="showInput" v-model="insertion" @blur="showInput = false"
            @keyup.enter.native="emitExtrInsert">
        </binnode-input>
    </div>
</template>

<script>
    import BinnodeInput from "./binnode-input.vue";
    export default {
        props: ['node'],
        data() {
            return { insertion: "", showInput: false };
        },
        components: {
            'binnode-input': BinnodeInput
        }, methods: {
            emitExtrInsert() {
                let insertion = this.$parent.assertNumber(this.insertion);
                if (insertion == null) return false;
                this.$emit('extr-insert', [this.node, insertion,
                (res) => {
                    if (res) this.insertion = "";
                }]);
            },
            divOnClick() {
                if (this.showInput === true) return false;
                this.showInput = true;
                process.nextTick(() => {
                    this.$refs.input.forceFocus();
                })
            }
        }
    }
</script>