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
        messages: {
            left: "", right: ""
        },
        treeClassMap: { "BinTree": BinTree, "BST": BST, "AVL": AVL },
        trees: { "BinTree": null, "BST": null, "AVL": null, "Splay": null, "RedBlack": null },
        structInfo: {
            nodes: [],
            extrNodes: [],
            edges: [[], []],
            extrEdges: [[], []],
        },
        topSequence: [],
        trvlParams: {
            interval: 500,
            lock: false
        },
        BSTParams: {
            allowExtrInsert: false,
        },
        alertTag: 0
    },
    methods: {
        init() {
            this.alertAsync("Init " + this.curTreeType);
            if (localStorage["temp" + this.curTreeType]) {
                console.log("Recover tree from localStorage.")
                let jsonTreeObj = JSON.retrocycle(JSON.parse(localStorage["temp" + this.curTreeType]));
                this.tree = this.curTreeClass.buildFromTreeJsonObj(jsonTreeObj);
            }
            else {
                console.log("Load default tree.")
                this.loadSampleTree();
            }
            this.reset();
        },
        reset() {
            console.log("Reset");
            this.messages = { left: "", right: "" };
            this.topSequence = [];
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
        },
        alertAsync(message, time = 1500) {
            this.messages.right = message;
            let tag = ++this.alertTag;
            setTimeout((e = tag) => {
                if (e === this.alertTag) this.messages.right = "";
            }, time);
        },
        traversal(method) {
            if (this.trvlParams.lock) return false;
            this.update();
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
            this.topSequence = [];
            this.messages.left = method == 0 ? "先序遍历" : (method == 1 ? "中序遍历" :
                (method == 2 ? "后续遍历" : (method == 3 ? "层次遍历" : "")));
            this._printSequenceAsyc(sequence, () => { this.trvlParams.lock = false; this.messages.left = "" });
        },
        _printSequenceAsyc(sequence, callback) {
            if (sequence.length == 0) {
                setTimeout(() => {
                    this.update();
                }, 2 * this.trvlParams.interval);
                if (typeof callback === "function") callback();
                return;
            }
            if (!this.trvlParams.lock) return false;
            let x = sequence.shift();
            this.topSequence.push(x.data);
            x.active = true;
            setTimeout(() => {
                x.active = false;
                if (this.trvlParams.lock) x.visited = true;
                this._printSequenceAsyc(sequence, callback);
            }, this.trvlParams.interval);
        },

        // Events Handlers
        onIntrUpdate(args) {  // Internal node requests for value update
            let node = args[0];
            let updation = args[1];
            let successMessage = `Change ${node.data} to ${updation}`;
            if (this.curTreeType !== "BinTree") {
                if (this.tree.search(updation)) {
                    this.alertAsync(`${updation} Exists!`);
                    return false;
                }
                if (!this.checkNodeOrder(node, updation)) return false;
            }
            node.data = updation;
            this.update();
            this.messages.left = successMessage;
        },  // TODO: active newly updated node. Update before and after every action.
        onExtrInsert(args) {  // External node requests for value insertion
            let node = args[0];
            let insertion = args[1];
            let curTreeType = this.curTreeType;

            if (curTreeType === "Splay") {
                this.alertAsync("Can't insert at external nodes in SplayTree.", 3000);
                return false;
            }
            if (curTreeType !== "BinTree") {
                if (this.tree.search(insertion)) {  // Decline duplicate
                    this.alertAsync(`${insertion} Exists!`);
                    return false;
                }
                // check new order
                if (!this.checkNodeOrder(node, insertion)) return false;
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
                this.tree.solveInsertUnbalance();   // TODO: change to async
            }
            this.update();
            this.messages.left = `Insert ${insertion}`;
        },
        checkNodeOrder(node, newV) {
            let pred, succ;
            let isLC = node.isLC || BinNode.isLC(node);
            if (isLC === true && newV > node.parent.data ||
                isLC === true && (pred = node.parent.pred()) && newV < pred.data ||
                isLC === false && newV < node.parent.data ||
                isLC === false && (succ = node.parent.succ()) && newV > succ.data ||
                node.lc && newV < node.lc.data || node.rc && newV > node.rc.data) {
                this.alertAsync("Must maintain order.", 2500);
                return false;
            } return true;
        },
        // Remove whole subtree
        onRemoveBelow(node) {
            this.tree.removeBelow(node);
            this.update();
            this.alertAsync(`Remove Below ${node.data}`);
        },
        // Remove one node
        onRemoveOne(node) {
            this.tree.removeAt(node);
            this.tree._size--;
            if (this.curTreeType === "AVL") {
                this.tree.search(node.data); // locate _hot
                this.tree.solveRemoveUnbalance();
            }
            else if (0) { }
            this.update();
            this.alertAsync(`Remove ${node.data}`);
        },
        // Proper Rebuild
        onTopBuild(sequence) {
            if (this.curTreeType !== "BinTree")
                this.alertAsync("请自行保证合法性, 不合法的树会造成操作异常.", 2500);
            this.tree.buildFromBinSequence(sequence);
            this.update();
            this.messages.left = "真二叉树层次序列构建";

            this.curTreeClass.checkValidity(this.tree, (res, message) => {
                if (!res) this.alertAsync(message, 3000);
            })
        },
        // Insert sequence
        onTopInsert(sequence) {
            console.log("Insert by sequence");
            this.topSequence = sequence;
            this.insertAsync();
        },
        insertAsync() {
            while (this.topSequence.length > 0 && this.topSequence[0] === null) this.topSequence.shift();
            if (this.topSequence.length === 0) { this.trvlParams.lock = false; return false; }
            let num = this.topSequence.shift();
            this.messages.left = `Insert ${num}`;
            this.trvlParams.lock = true;
            this.searchAsync(this.tree.root(), num, (res) => {
                if (res) this.alertAsync(`${num} Exists`);
                else { this.tree.insert(num); this.alertAsync(`${num} Inserted`); }
                this.update();
                this.trvlParams.lock = true;
                this.insertAsync();
            })
        },
        // Search value
        onTopSearch(num) {
            this.update();
            this.trvlParams.lock = true;
            this.messages.left = `Search ${num}`;
            this.searchAsync(this.tree.root(), num, (res) => {
                if (res) this.alertAsync("Found");
                else Math.random() < 0.5 ? this.alertAsync("Not Found") : this.alertAsync("404");
            });
        },
        onTopHelp(message) {
            this.alertAsync(message, 5000);
        },
        // Proper Binary Tree Sequence
        onTopProper() {
            let sequence = BinTree.properTraversal(this.tree.root());
            for (let i = 0; i < sequence.length; i++) sequence[i] = sequence[i] ? sequence[i].data : null;
            let last = sequence.length - 1;
            while (sequence[last] === null) last--;
            sequence.splice(last + 1);
            this.topSequence = sequence;
        },
        searchAsync(node, num, callback) {
            if (!this.trvlParams.lock || !node) {
                this.trvlParams.lock = false;
                if (typeof callback === "function") callback(false);
                return false;
            }
            node.active = true;
            if (num === node.data) {
                this.trvlParams.lock = false; {
                    if (typeof callback === "function") callback(true);
                    return true;
                }
            } else {
                setTimeout(() => {
                    node.active = false;
                    node.visited = true;
                    if (num < node.data) node = node.lc;
                    else node = node.rc;
                    this.searchAsync(node, num, callback);
                }, this.trvlParams.interval);
            }
        },
        // Drag tree
        onTreeMouseDown(event) {
            console.log("Start drag")
            this.treeXY = [event.target.offsetLeft, event.target.offsetTop];
            switch (event.type) {
                case "mousedown": this.mouseXY = [event.x, event.y]; break;
                case "touchstart":
                    this.mouseXY = [event.touches[0].clientX, event.touches[0].clientY];
                    break;
                default: return;
            }
            this.is_moving = true;
        },
        onTPMouseMove: function (event) {
            if (this.is_moving) {
                let newXY;
                switch (event.type) {
                    case "mousemove": newXY = [event.x, event.y]; break;
                    case "touchmove":
                        newXY = [event.touches[0].clientX, event.touches[0].clientY];
                        break;
                    default: return;
                }
                this.$refs.tree.style.left = this.treeXY[0] + newXY[0] - this.mouseXY[0] + "px";
                this.$refs.tree.style.top = this.treeXY[1] + newXY[1] - this.mouseXY[1] + "px";
            }
        },
        onTreeMouseLeave(e) {
            console.log("mouse leave")
            this.is_moving = false;
        },
        // Validators
        assertNumber(x) {
            if (typeof x === "string") x = x.trim();
            if (x === "") return null;
            x = Number(x);
            if (isNaN(x)) return null;
            if (x > 666666666666) return 666666666666;
            return x;
        },
        strToArr(str) {
            str = str.trim();
            if (str === "") return null;
            let arr = str.split(/,|，/);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = this.assertNumber(arr[i]);
            }
            return arr;
        },
    },
    computed: {
        tree: {
            get() { return this.trees[this.curTreeType]; },
            set(newTree) {
                this.trees[this.curTreeType] = newTree;
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