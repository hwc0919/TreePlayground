import Vue from "./js/vue"

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

var vm = new Vue({
    el: "#TreePlayground",
    data: {
        availTreeTypes: { "BinTree": true, "BST": true, "AVL": false, "Splay": false, "RedBlack": false },
        commonParams: {
            treeScale: 100,
            curTreeType: "BinTree",
            offsetLeft: 0,
            offsetTop: 0
        },
        treeClassMap: { "BinTree": BinTree, "BST": BST },
        trees: { "BinTree": null, "BST": null },
        // tree: null,
        structInfo: {
            nodes: [],
            extrNodes: [],
            edges: [[], []],
            extrEdges: [[], []],
        },
        trvlParams: {
            sequence: [],
            interval: 500,
            lock: false
        },
        BSTParams: {
            allowExtrInsert: false,
        },
    },
    methods: {
        init() {
            console.log("Init " + this.curTreeType);
            if (localStorage["temp" + this.curTreeType]) {
                console.log("Recover tree from localStorage.")
                let jsonTreeObj = JSON.retrocycle(JSON.parse(localStorage["temp" + this.curTreeType]));
                this.tree = this.curTreeClass.buildFromTreeJsonObj(jsonTreeObj);
            }
            else {
                console.log("Load default tree.")
                this.loadSampleTree();
            }
        },
        reset() {
            console.log("Reset");
            this.trvlParams.lock = false;
            this.update();
        },
        update() {
            console.log("Update");
            this.trvlParams.lock = false;
            this.structInfo = this.tree.calStructInfo();
            // Save to localStorage
            localStorage["temp" + this.curTreeType] = JSON.stringify(JSON.decycle(this.tree));
            localStorage.commonParams = JSON.stringify(this.commonParams);
        },

        saveToHistory() {

        },
        loadFromHistory() {

        },
        loadSampleTree() {
            this.tree = this.curTreeClass.genSampleTree();
            this.update();
        },
        traversal(method) {
            if (this.trvlParams.lock) return false;
            this.trvlParams.lock = true;
            let sequence;
            if (method === 0)
                sequence = BinTree.preorderTraversal(this.tree.root());
            else if (method == 1)
                sequence = BinTree.inorderTraversal(this.tree.root());
            else if (method == 2)
                sequence = BinTree.postorderTraversal(this.tree.root());
            else if (method == 3)
                sequence = BinTree.levelTraversal(this.tree.root());
            // display traversal sequence
            this.trvlParams.sequence = [];
            this._printSequenceAsyc(sequence);
        },
        _printSequenceAsyc(sequence) {
            if (sequence.length == 0) {
                this.trvlParams.lock = false;
                return;
            }
            if (!this.trvlParams.lock) return false;
            let x = sequence.shift();
            this.trvlParams.sequence.push(x);
            x.active = true;
            setTimeout(() => {
                x.active = false;
                this._printSequenceAsyc(sequence);
            }, this.trvlParams.interval);
        },

        // Events Handlers
        onIntrUpdate(args) {
            console.log("onIntrUpdate");
            let node = args[0];
            let updation = args[1];
            if (this.curTreeType !== "BinTree") {
                if (this.tree.search(updation)) {
                    alert("Already exists!");
                    return false;
                } else if (BinNode.isLC(node) && updation > node.parent.data ||
                    BinNode.isRC(node) && updation < node.parent.data ||
                    node.lc && updation < node.lc.data ||
                    node.rc && updation > node.rc.data) {
                    alert("Must maintain order.");
                    return false;
                }
            }
            node.data = updation;
            this.update();
        },
        onExtrInsert(args) {
            console.log("onExtrInsert");
            let node = args[0];
            let insertion = args[1];

            if (this.curTreeType !== "BinTree" && this.curTreeType !== "BST") return false;
            if (this.curTreeType === "BST") {
                if (this.tree.search(insertion)) {  // Decline duplicate
                    alert("Already exists!");
                    return false;
                }
                // pred and succ of parent
                let pred, succ;
                if (node.isLC === true && insertion > node.parent.data ||
                    node.isLC === true && (pred = node.parent.pred()) && insertion < pred.data ||
                    node.isLC === false && insertion < node.parent.data ||
                    node.isLC === false && (succ = node.parent.succ()) && insertion > succ.data) {
                    alert("Must maintain order.");
                    return false;
                }
                if (!this.BSTParams.allowExtrInsert) {
                    if (!confirm("Enable external insertion for BST?")) return false;
                    else this.BSTParams.allowExtrInsert = true;
                }
            }
            if (node.isRoot)
                this.tree.insertAsRoot(insertion);
            else if (node.isLC)
                this.tree.insertAsLC(node.parent, insertion);
            else
                this.tree.insertAsRC(node.parent, insertion);
            this.update();
        },
        onRemoveBelow(node) {
            console.log("onRemoveBelow");
            this.tree.removeBelow(node);
            this.update();
        },
        onRemoveOne(node) {
            console.log("onRemoveOne");
            this.tree.removeAt(node);
            this.update();
        },
        onTreeMouseDown(event) {
            console.log("mouse down")
            this.treeXY = [event.target.offsetLeft, event.target.offsetTop];
            this.mouseXY = [event.x, event.y];
            this.is_moving = true;
        },
        onTPMouseMove: function (event) {
            if (this.is_moving) {
                this.$refs.tree.style.left = this.treeXY[0] + event.x - this.mouseXY[0] + "px";
                this.$refs.tree.style.top = this.treeXY[1] + event.y - this.mouseXY[1] + "px";
            }
        },
        onTreeMouseLeave(e) {
            this.is_moving = false;
        },
        // Validators
        assertNumber(x) {
            x = Number(x);
            if (isNaN(x)) return null;
            if (x > 66666666666) return 66666666666;
            return x;
        }
    },
    computed: {
        tree: {
            get() { return this.trees[this.curTreeType]; },
            set(newTree) {
                this.trees[this.curTreeType] = newTree;
                this.update();
            }
        },
        curTreeType: {
            get() { return this.commonParams.curTreeType; },
            set(newV) { this.commonParams.curTreeType = newV; }
        },
        treeScale: {
            get() { return this.commonParams.treeScale; },
            set(newV) { this.commonParams.treeScale = newV; }
        },

        curTreeClass() {
            return this.treeClassMap[this.curTreeType];
        },
        adjustScale() {
            let scale = this.treeScale / 100;
            return `transform:scale(${scale})`;
        }
    },
    watch: {
        tree: {
            handler(oldV, newV) {
                console.log("Detect Change in tree.");
                // this.update();
            },
            deep: true,
        },
        // Init tree object when tree type changes.
        curTreeType() {
            this.init();
        },
        commonParams: {
            handler() {
                localStorage.commonParams = JSON.stringify(this.commonParams);
            }, deep: true
        }
    },
    mounted() {
        // this.curTreeType = localStorage.curTreeType;
        try { this.commonParams = JSON.parse(localStorage.commonParams); }
        catch (err) { }
        if (this.availTreeTypes[this.curTreeType] == undefined) this.curTreeType = "BinTree";
        this.init();
    },
});

window.vm = vm;