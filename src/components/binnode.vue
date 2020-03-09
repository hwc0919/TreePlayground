<!-- Internal BinNode -->
<template>
    <div class="binnode intr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}" @click="divOnClick">
        <span v-show="!showInput" :title="title"
            style="display: inline-block; width: 100%; height: 100%;">{{ node.data }}</span>
        <label v-show="showRemoveOne" class="node-delete-btn node-upper-btn" title="remove one"
            @click.stop="$emit('remove-one', node)">&times;</label>
        <label v-show="showRemoveBelow" class="subtree-delete-btn node-upper-btn" title="remove below"
            @click.stop="$emit('remove-below', node)">&times;</label>
        <binnode-input ref="input" v-show="showInput" v-model="updation" @blur="inputOnBlur"
            @keyup.enter.native="emitIntrUpdate($event)">
        </binnode-input>
    </div>
</template>

<script>
    import BinnodeInput from "./binnode-input.vue";
    export default {
        props: ['node'],
        data() {
            return { showInput: false, updation: this.node.data }
        },
        components: {
            'binnode-input': BinnodeInput
        }, methods: {
            emitIntrUpdate(e) {
                let x = this.$parent.assertNumber(this.updation);
                if (x == null) { e.srcElement.blur(); return false; }
                if (x == this.node.data) { this.updation = x; e.srcElement.blur(); return false; }
                this.$emit('intr-update', [this.node, x]);
                this.updation = "";
                this.inputOnBlur(); // force lose focus
            },
            divOnClick() {
                if (this.showInput === true) return false;
                this.updation = this.node.data;
                this.showInput = true;
                console.log(this.$refs)
                process.nextTick(() => {
                    this.$refs.input.forceFocus();
                })
            },
            inputOnBlur() {
                this.showInput = false;
                this.updation = this.node.data;
            }
        },
        computed: {
            title() {
                return `height: ${this.node.height}\nsize: ${this.node.size()}\nnpl:${this.node.npl}`
            },
            /* **************************************** */
            /* ************ Remove Buttons ************ */
            /* **************************************** */
            showRemoveBelow() { // Only BinTree or BST or Root!
                let curTreeType = this.$parent.commonParams.curTreeType;
                return curTreeType === "BinTree" || curTreeType === "BST" || !this.node.parent;
            },
            showRemoveOne() { // Except BinTree and Splay!
                let curTreeType = this.$parent.commonParams.curTreeType;
                return curTreeType !== "BinTree";
            }
        }
    }
</script>