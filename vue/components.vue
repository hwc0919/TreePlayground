Vue.component('binnode', {
    props: ['node'],
    template:
        `<span class="binnode intr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}">
        {{ node.data }}
        </span>`
});

Vue.component('extr-binnode', {
    data: function () {
        return { insertion: "", showInput: false };
    },
    props: ['node'],
    template:
        `<div class="binnode extr-binnode" :style="{'left': node.x + 'px', 'top': node.y + 'px'}"    
            @click="showInput = true">
            <extr-binnode-input v-show="showInput" v-model="insertion" @hideInput="showInput = false" @extr-insert="$emit('extr-insert', [node, insertion])">
            </extr-binnode-input>
        </div>
        `,
    methods: {
    },
    watch: {
    }
});

// <input class="extr-binnode-input" v-show="showInput" v-model.number="insertion" type=number>
Vue.component('extr-binnode-input', {
    template: `
        <input class="extr-binnode-input" :style="{'width': width}" v-model="value"
         @blur="$emit('hideInput')"  @keyup.enter="emitExtrInsert">
    `,
    data: function () {
        return {
            value: "", width: "40px"
        }
    }, methods: {
        emitExtrInsert() {
            if (this.value == "") return false;
            this.$emit('extr-insert');
            this.value = "";
        }
    },
    watch: {
        value(newV, oldV) {
            if (/^[0-9]*$/.exec(newV) == null)
                this.value = oldV;
            else {
                this.width = this.value.toString().length * 16 + "px";
                this.$emit("input", Number(newV));
            }
        }
    }
})