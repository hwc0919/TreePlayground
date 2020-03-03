import Vue from "./js/vue"
import "./components/components"

var vm = new Vue({
    el: "#TreePlayground",
    data: {
        availTreeTypes: { "BinTree": true, "BST": true, "AVL": true, "Splay": false, "RedBlack": false },
        commonParams: {
            treeScale: 100,
            curTreeType: "BinTree",
        },
        treeClassMap: { "BinTree": BinTree, "BST": BST, "AVL": AVL },
        trees: { "BinTree": null, "BST": null, "AVL": null, "Splay": null, "RedBlack": null },
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
            this.treeScale = 100;
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

        saveToHistory() { },
        loadFromHistory() { },
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
        onIntrUpdate(args) {  // Internal node requests for value update
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
        onExtrInsert(args) {  // External node requests for value insertion
            console.log("onExtrInsert");
            let node = args[0];
            let insertion = args[1];
            let curTreeType = this.curTreeType;

            if (curTreeType === "Splay") {
                alert("Can't insert at external nodes in SplayTree.");
                return false;
            }
            if (curTreeType !== "BinTree") {
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
            }
            var updateH;
            if (curTreeType === "BinTree" || curTreeType === "BST")
                updateH = true;
            else
                updateH = false;

            if (node.isRoot)
                this.tree.insertAsRoot(insertion, updateH);
            else if (node.isLC)
                this.tree.insertAsLC(node.parent, insertion, updateH);
            else
                this.tree.insertAsRC(node.parent, insertion, updateH);

            if (curTreeType === "AVL") {
                this.tree.search(insertion);    // locate _hot
                this.tree.solveInsertUnbalance();
            }
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
            this.tree._size--;
            if (this.curTreeType === "AVL") {
                this.tree.search(node.data); // locate _hot
                this.tree.solveRemoveUnbalance();
            }
            else if (0) { }
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
        try { this.commonParams = JSON.parse(localStorage.commonParams); }
        catch (err) { }
        if (this.availTreeTypes[this.curTreeType] == undefined) this.curTreeType = "BinTree";
        this.init();
    },
});

window.vm = vm;