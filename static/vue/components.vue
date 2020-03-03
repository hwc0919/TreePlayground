// Internal BinNode
import Vue from "../js/vue"

Vue.component('binnode', {
    props: ['node'],
    data() {
        return { showInput: false, updation: this.node.data }
    },
    template:
        `<div class="binnode intr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}" @click="divOnClick">
            <span v-show="!showInput" style="display: inline-block; width: 100%; height: 100%;">{{ node.data }}</span>
            <label type="button" class="subtree-delete-btn delete-btn" title="remove below"
                @click.stop="$emit('remove-below', node)">x</label>
            <label v-show="$root.curTreeType !== 'BinTree'" type="button" class="node-delete-btn delete-btn" title="remove one" 
                @click.stop="$emit('remove-one', node)">x</label>
            <binnode-input ref="input" v-show="showInput" v-model="updation" @blur.native="inputOnBlur" @keyup.enter.native="emitIntrUpdate($event)">
            </binnode-input>
        </div>`,
    methods: {
        emitIntrUpdate(e) {
            let x = this.$parent.assertNumber(this.updation);
            if (x == null) { e.srcElement.blur(); return false; }
            if (x == this.node.data) { this.updation = x; e.srcElement.blur(); return false; }
            this.$emit('intr-update', [this.node, x]);
            this.updation = "";
            e.srcElement.blur();   // force lose focus
        },
        divOnClick() {
            if (this.showInput === true) return false;
            this.updation = this.node.data;
            this.showInput = true;
            let width = this.$el.offsetWidth;
            setTimeout(() => {
                this.$refs.input.$el.focus();
                this.$refs.input.width = width - 20;
            }, 1);
        },
        inputOnBlur() {
            this.showInput = false;
            this.updation = this.node.data;
        }
    }
});

// External BinNode
Vue.component('extr-binnode', {
    data: function () {
        return { insertion: "", showInput: false };
    },
    props: ['node'],
    template:
        `<div class="binnode extr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}" @click="showInput = true">
            <binnode-input v-show="showInput" v-model="insertion" @blur.native="showInput = false" 
                @keyup.enter.native="emitExtrInsert">
            </binnode-input>
        </div>
        `,
    methods: {
        emitExtrInsert() {
            let x = this.$parent.assertNumber(this.insertion);
            if (x == null) return;
            this.$emit('extr-insert', [this.node, x]);
            this.insertion = "";
        }
    }
});

Vue.component('binnode-input', {
    data: function () {
        return {
            width: 40
        }
    }, props: ['value'],
    template: `
        <input class="extr-binnode-input" :style="{'width': width + 'px'}" :value="value"
            v-on:input="$emit('input', $event.target.value)">
    `,
    methods: {
    },
    watch: {
        value() {
            this.width = this.value.toString().length * 16;
        }
    }
})