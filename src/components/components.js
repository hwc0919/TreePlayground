import Vue from "../js/vue"
import { BinNode } from "../js/BinNode";

Vue.component('binnode-input', {
    data: function () {
        return {
            width: 40
        }
    }, props: ['value'],
    template: `
        <div>
            <input ref="input" class="binnode-input" :style="{'width': width + 'px' }" :value="value"
                @input="$emit('input', $event.target.value)" @blur="$emit('blur')" @focus="onFocus">
            <span ref="widthIndicator" style="display: inline-block; visibility: hidden; position: absolute; padding: 10px">{{ value }}</span>
        </div>
    `,
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
            this.width = this.$refs.widthIndicator.offsetWidth;
        }
    }
})


Vue.component('binnode', {
    props: ['node'],
    data() {
        return { showInput: false, updation: this.node.data }
    },
    template:
        `<div class="binnode intr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}" @click="divOnClick">
            <span v-show="!showInput" style="display: inline-block; width: 100%; height: 100%;">{{ node.data }}</span>
            <label v-show="showRemoveOne" class="node-delete-btn node-upper-btn" title="remove one" 
                @click.stop="$emit('remove-one', node)">&times;</label>
            <label v-show="showRemoveBelow" class="subtree-delete-btn node-upper-btn" title="remove below"
                @click.stop="$emit('remove-below', node)">&times;</label>
            <binnode-input ref="input" v-show="showInput" v-model="updation" @blur="inputOnBlur" @keyup.enter.native="emitIntrUpdate($event)">
            </binnode-input>
        </div>`,
    methods: {
        emitIntrUpdate(e) {
            let x = this.$parent.assertNumber(this.updation);
            if (x == null) { e.srcElement.blur(); return false; }
            if (x == this.node.data) { this.updation = x; e.srcElement.blur(); return false; }
            this.$emit('intr-update', [this.node, x]);
            this.updation = "";
            this.inputOnBlur();   // force lose focus
        },
        divOnClick() {
            if (this.showInput === true) return false;
            this.updation = this.node.data;
            this.showInput = true;
            setTimeout(() => {
                this.$refs.input.forceFocus();
            }, 1);
        },
        inputOnBlur() {
            this.showInput = false;
            this.updation = this.node.data;
        }
    },
    computed: {
        showRemoveBelow() {
            var curTreeType = this.$parent.commonParams.curTreeType;
            return curTreeType === "BinTree" || curTreeType === "BST" || !this.node.parent;
        },
        showRemoveOne() {
            var curTreeType = this.$parent.commonParams.curTreeType;
            return curTreeType !== "BinTree";
        }
    }
});

// External BinNode
Vue.component('extr-binnode', {
    data() {
        return { insertion: "", showInput: false };
    },
    props: ['node'],
    template:
        `<div class="binnode extr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}" @click="divOnClick">
            <binnode-input ref="input" v-show="showInput" v-model="insertion" @blur.native="showInput = false" 
                @keyup.enter.native="emitExtrInsert">
            </binnode-input>
        </div>
        `,
    methods: {
        emitExtrInsert() {
            let insertion = this.$parent.assertNumber(this.insertion);
            if (insertion == null) return false;
            this.$emit('extr-insert', [this.node, insertion]);
            this.insertion = "";
        },
        divOnClick() {
            if (this.showInput === true) return false;
            this.showInput = true;
            setTimeout(() => {
                this.$refs.input.forceFocus();
            }, 1);
        }
    }
});

{/*  */ }

Vue.component('top-binnode', {
    data() {
        return { sequence: this.data.toString(), showInput: false };
    },
    props: ['data'],
    template:
        `<div class="binnode top-binnode" @click="divOnClick">
            <span v-show="!showInput" style="display: inline-block; width: 100%; height: 100%;">{{ sequence }}</span>
            <label class="top-build-btn node-upper-btn" title="由真二叉树层次遍历序列构建, 逗号分隔. 自行保证序列合法性." 
                @click.stop="emitTopBuild"><i>B</i></label>
                <label class="top-insert-btn node-upper-btn" title="按次序插入" @click.stop="emitTopInsert"><i>I</i></label>
                <label class="top-search-btn node-upper-btn" title="查找单个数值" @click.stop="emitTopSearch"><i>S</i></label>
            <binnode-input ref="input" v-show="showInput" v-model="sequence" @blur="showInput=false" @keyup.enter.native="emitTopInsert">
            </binnode-input>
        </div>`,
    methods: {
        divOnClick() {
            if (this.showInput === true) return false;
            this.showInput = true;
            setTimeout(() => {
                this.$refs.input.forceFocus();
            }, 1);
        },
        emitTopBuild() {
            if (this.$parent.tree && this.$parent.tree.root())
                if (!confirm("Overwrite current tree?")) return false;

            let sequence = this.$parent.strToArr(this.sequence);
            this.sequence = sequence.toString();

            if (sequence[0] === null) {
                alert("Empty Root!");
                return false;
            }
            this.$emit('top-build', sequence);
        },
        emitTopInsert() {
            let sequence = this.$parent.strToArr(this.sequence);
            this.sequence = sequence.toString();
            this.$emit('top-insert', sequence);
        },
        emitTopSearch() {
            let num = this.$parent.assertNumber(this.sequence);
            if (num === null) return false;
            this.sequence = num.toString();
            this.$emit('top-search', num);
        }
    },
    watch: {
        data() {
            this.sequence = this.data.toString();
        }
    }
});