// Internal BinNode
Vue.component('binnode', {
    props: ['node'],
    data() {
        return { showInput: false, updation: this.node.data }
    },
    template:
        `<div class="binnode intr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}">
            <span v-show="!showInput" style="display: inline-block; width: 100%; height: 100%;" @click="showInput = true">{{ node.data }}</span>
            <label type="button" class="subtree-delete-btn delete-btn" title="remove below"
                @click="$emit('remove-below', node)">x</label>
            <label type="button" class="node-delete-btn delete-btn" title="remove one">x</label>
            <binnode-input v-show="showInput" v-model="updation" @blur.native="showInput = false" @keyup.enter.native="intrUpdateData($event)">
            </binnode-input>
        </div>`,
    methods: {
        intrUpdateData(e) {
            if (this.updation == "" || this.updation == this.data) return false;
            if (/^[0-9]*$/.exec(this.updation))
                this.updation = Number(this.updation);
            this.node.data = this.updation;
            this.$parent.update();
            e.srcElement.blur();   // force lose focus
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
            if (this.insertion == "") return false;
            if (/^[0-9]*$/.exec(this.insertion))
                this.insertion = Number(this.insertion);
            this.$emit('extr-insert', [this.node, this.insertion]);
            this.insertion = "";
        }
    },
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