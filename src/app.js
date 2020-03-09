import Vue from "../node_modules/vue/dist/vue.min"
import IntrBinnode from "./components/binnode.vue"
import ExtrBinnode from "./components/extr-binnode.vue"
import TopBinnode from "./components/top-binnode.vue"
import { BinNode } from "./js/BinNode"
import { BinTree } from "./js/BinTree"
import { BST } from "./js/BST"
import { AVL } from "./js/AVL"
import { Splay } from "./js/Splay"

var tp = new Vue({
    el: "#TreePlayground",
    data: {
        availTreeTypes: { "BinTree": true, "BST": true, "AVL": true, "Splay": true, "RedBlack": false },
        commonParams: {
            curTreeType: "BST", // Important : Always use as `this.curTreeType`.
            treeScale: 100, // in %
            interval: 500   // in ms
        },
        messages: {
            left: "", right: ""
        },
        treeClassMap: { "BinTree": BinTree, "BST": BST, "AVL": AVL, "Splay": Splay },
        trees: { "BinTree": null, "BST": null, "AVL": null, "Splay": null, "RedBlack": null },
        structInfo: {
            nodes: [],
            extrNodes: [],
            edges: [[], []],
            extrEdges: [[], []],
        },
        locks: {    // TODO : seperate trvlLock and searchLock. this can wait.
            trvlLock: false,
            rotateLock: false
        },
        topSequence: [],
        BSTParams: {
            allowExtrInsert: false,
        },
        alertTag: 0,
        messageTag: 0
    },
    components: {
        'binnode': IntrBinnode,
        'extr-binnode': ExtrBinnode,
        'top-binnode': TopBinnode
    },
    methods: {
        // Init, called when change curTreeType & first mounted
        init() {
            this.alertAsync("Init " + this.curTreeType, 100, false);
            if (localStorage["temp" + this.curTreeType]) {
                this.alertAsync("Read localStorage.", 100, false)
                try {
                    let jsonTreeObj = JSON.retrocycle(JSON.parse(localStorage["temp" + this.curTreeType]));
                    this.tree = this.curTreeClass.buildFromTreeJsonObj(jsonTreeObj);
                } catch (err) {
                    this.alertAsync("Error reading localStorage.")
                    this.loadSampleTree();
                }
            }
            else {
                this.alertAsync("Load default tree.", 100, false)
                this.loadSampleTree();
            }
            this.reset(false);
        },
        // Reset, clear all messages and lock. Will call update() inside.
        reset(all = true) {
            if (all) {
                this.messages = { left: "", right: "" };
                this.topSequence = [];
            }
            this.alertAsync("Reset", 150, false);
            this.isDragging = false;
            for (let lock in this.locks) this.locks[lock] = false;
            this.update();
        },
        // Update, update tree structure ONLY! Then save to LocalStorage. Please Always call explicitly!!!
        update() {
            console.log("Update");
            this.structInfo = this.tree.calStructInfo();
            // Save to localStorage
            localStorage["temp" + this.curTreeType] = JSON.stringify(JSON.decycle(this.tree));
            localStorage.commonParams = JSON.stringify(this.commonParams);
        },
        // Generate new sample.
        loadSampleTree() {
            this.showMessage(`Load Sample ${this.curTreeType}`, 1000);
            this.tree = this.curTreeClass.genSampleTree();
        },
        // non-blocking message box on the right side. `time` <= 0 means forever.
        alertAsync(message, time = 1500, forceAlert = true) {
            if (this.messages.right === "" || forceAlert) {
                this.messages.right = message;
                let tag = ++this.alertTag;
                if (time > 0) {
                    setTimeout((e = tag) => {
                        if (e === this.alertTag) this.messages.right = "";
                    }, time);
                }
            } else setTimeout(() => { this.alertAsync(message, time, false) }, 100);
        },
        // Show message on left side. Similar to `alertAsync()` but default forever
        showMessage(message, time = -1, forceAlert = true) {
            if (this.messages.left === "" || forceAlert) {
                this.messages.left = message;
                let tag = ++this.messageTag;
                if (time > 0) {
                    setTimeout((e = tag) => {
                        if (e === this.messageTag) this.messages.left = "";
                    }, time);
                }
            } else setTimeout(() => { this.showMessage(message, time, false) }, 100);
        },
        // Traversal and Display in Async way.
        traversal(method) {
            if (this.isAnyLocked()) return false;
            this.update();
            this.locks.trvlLock = true;
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
            this._printSequenceAsyc(sequence, () => { this.locks.trvlLock = false; this.messages.left = "" });
        },
        // Print sequence Async & Recur, and push to `topSequence`
        _printSequenceAsyc(sequence, callback) {
            if (sequence.length == 0) {
                setTimeout(() => {
                    this.update();
                }, 2 * this.commonParams.interval);
                if (typeof callback === "function") callback();
                return;
            }
            if (!this.locks.trvlLock) return false;
            let x = sequence.shift();
            this.topSequence.push(x.data);
            x.active = true;
            setTimeout(() => {
                x.active = false;
                if (this.locks.trvlLock) x.visited = true;
                this._printSequenceAsyc(sequence, callback);
            }, this.commonParams.interval);
        },

        /****************************************/
        /*           Events Handlers            */
        /****************************************/

        // Internal node requests for value update
        onIntrUpdate(args) {
            if (this.isAnyLocked()) return false;
            this.update();
            let node = args[0];
            let updation = args[1];
            let successMessage = `Change ${node.data} to ${updation}`;
            if (this.curTreeType !== "BinTree") {
                if (this.tree.staticSearch(updation)) {
                    this.alertAsync(`${updation} Exists!`);
                    return false;
                }
                if (!this.checkNodeOrder(node, updation)) return false;
            }
            node.data = updation;
            this.update();
            this.messages.left = successMessage;
            node.active = true;   // Caution: Mark recent active
        },
        // External node requests for value insertion
        onExtrInsert(args) {
            this.update();
            let node = args[0];
            let insertion = args[1];
            let callback = args[2];
            let curTreeType = this.curTreeType;

            if (curTreeType === "Splay") {
                this.alertAsync("Can't insert at external nodes in SplayTree.", 3000);
                return false;
            }
            if (curTreeType !== "BinTree") {
                if (this.tree.staticSearch(insertion)) {  // Decline duplicate
                    this.alertAsync(`${insertion} Exists!`);
                    return false;
                }
                // check new order
                if (!this.checkNodeOrder(node, insertion)) return false;
            }
            var updateH, retNode;
            if (curTreeType === "BinTree" || curTreeType === "BST")
                updateH = true;
            else
                updateH = false;

            if (node.isRoot)
                retNode = this.tree.insertAsRoot(insertion, updateH);
            else if (node.isLC)
                retNode = this.tree.insertAsLC(node.parent, insertion, updateH);
            else
                retNode = this.tree.insertAsRC(node.parent, insertion, updateH);

            if (curTreeType === "AVL") {
                this.tree.staticSearch(insertion);    // locate _hot
                this.tree.solveInsertUnbalance();   // TODO: change to async
            }
            this.update();
            retNode.active = true;  // Caution: Mark recent active
            this.messages.left = `Insert ${insertion}`;
            if (typeof callback === "function") callback(true);
        },
        // Remove whole subtree
        onRemoveBelow(node) {
            if (this.isAnyLocked()) return false;
            this.tree.removeBelow(node);
            this.update();
            this.alertAsync(`Remove Below ${node.data}`);
        },
        // Remove one node
        onRemoveOne(node) {
            if (this.isAnyLocked()) return false;
            this.showMessage(`Remove ${node.data}`);
            if ("Splay" === this.curTreeType) {  // Exception : Deal with Splay
                this.alertAsync(`Step 1: Splay ${node.data}`, -1);
                node.active = true;
                setTimeout(() => {
                    // Splay RM Step 1
                    this.locks.rotateLock = true;
                    this.splayAsync(node, (rootOrNull) => {
                        if (rootOrNull === undefined) return false;
                        if (rootOrNull === null) throw "Error in RemoveOne";
                        let v = rootOrNull;
                        let tree = this.tree;
                        tree._size--;
                        if (!v.rc || !v.rc) {  // Splay RM Step 2a
                            if (!v.rc) { if (tree._root = v.lc) tree._root.parent = null; }
                            else { if (tree._root = v.rc) tree._root.parent = null; }
                            this.alertAsync(`Final: remove ${node.data}`, 2500);
                            this.update();
                        } else {  // Splay RM Step 2b
                            node.active = false; node.deprecated = true;
                            this.locks.trvlLock = true;
                            this.alertAsync(`Step 2: Elevate Succ of ${node.data}`, -1);
                            this.searchAsync(v.rc, v.data, (_, hot) => {
                                this.locks.rotateLock = true;
                                this.splayAsync(hot, (newRoot) => {
                                    // Splay RM Step 3
                                    this.alertAsync(`Step 3: Finally remove ${node.data}`, 2500);
                                    tree.reAttachAsLC(newRoot, v.lc);
                                    this.update();
                                })
                            })
                        }
                    })
                }, this.commonParams.interval);
            } else {  // Deal with other trees
                if (!node.lc || !node.rc) { // Other Trees: Simple Situation
                    this.tree.removeAt(node); this.tree._size--;
                    this.alertAsync(`${node.data} Removed.`, 2500);
                    this.update();
                    if ("AVL" === this.curTreeType) {
                        this.alertAsync(`${node.data} Removed, solve AVL Unbalance`, -1);
                        setTimeout(() => {
                            this.locks.rotateLock = true;
                            this.avlRmRotateAsync(this.tree._hot, () => {
                                this.alertAsync(`AVL Balanced again.`);
                                this.update();
                            });
                        }, this.commonParams.interval);
                    }
                } else { // Other Trees: Complex situation
                    // RM Step 1: Find Succ
                    this.alertAsync(`Step 1: Find Succ`, -1);
                    let succ = node.succ();
                    node.deprecated = true;
                    this.locks.trvlLock = true; // TODO : change to srchLock
                    this.searchAsync(node, succ.data, () => { // assert res === true
                        // RM Step 2: Swap with Succ
                        this.alertAsync(`Step 2: Swap with Succ`, -1);
                        this.update();
                        node.deprecated = true; succ.active = true;
                        setTimeout(() => {
                            let t = node.data; node.data = succ.data; succ.data = t;
                            node.deprecated = false; succ.active = false;
                            node.active = true; succ.deprecated = true;
                            // RM Step 3: Remove
                            this.alertAsync(`Step 3: Remove ${t}`, 2500);
                            setTimeout(() => {
                                this.tree.removeAt(succ);
                                this.update();
                                // RM Step 4 : AVL reBalance
                                if ("AVL" === this.curTreeType) {
                                    this.alertAsync(`Step 4: AVL reBalance`, -1);
                                    if (this.tree._hot) this.tree._hot.active = true;
                                    setTimeout(() => {
                                        this.locks.rotateLock = true;
                                        this.avlRmRotateAsync(this.tree._hot, () => {
                                            this.alertAsync(`AVL Balanced again.`);
                                            this.update();
                                        });
                                    }, this.commonParams.interval);
                                }
                            }, this.commonParams.interval);
                        }, this.commonParams.interval);
                    })
                }
            }
        },
        // Async version of AVL.solveRemoveUnbalance
        avlRmRotateAsync(node, callback) { // Important: SET rotateLock BEFORE START
            if (!node || !this.locks.rotateLock || "AVL" !== this.curTreeType) {
                this.locks.rotateLock = false;
                if (typeof callback == "function") callback();
                return;
            }
            node.active = true;
            setTimeout(() => {
                let interval = this.commonParams.interval;
                if (!AVL.avlBalanced(node))
                    this.tree.rotateAt(BinNode.tallerChild(BinNode.tallerChild(node)));
                else interval = 0;
                this.tree.update_height(node);
                this.update();
                node.active = true;
                setTimeout(() => {
                    node.active = false;
                    this.avlRmRotateAsync(node.parent, callback);
                }, interval);
            }, this.commonParams.interval)
        },
        // Proper Rebuild
        onTopBuild(sequence) {
            if (this.curTreeType !== "BinTree")
                this.alertAsync("请自行保证合法性, 不合法的树会造成操作异常.", 2500);
            this.tree.buildFromBinSequence(sequence);
            this.update();
            this.messages.left = "真二叉树层次序列构建";
            let res = this.curTreeClass.checkValidity(this.tree);
            if (!res[0]) this.alertAsync(res[1], 2500);
        },
        // Insert `topSequence` by calling async
        onTopInsert(sequence) {
            if (this.isAnyLocked()) return false;
            // if (this.isAnyLocked) return false;
            if ("BinTree" === this.curTreeType) { this.alertAsync("BinTree can't insert."); return false; }
            console.log("Insert by sequence");
            this.update();
            this.topSequence = sequence;
            this.insertSequnceAsync();
        },
        // Insert `topSequence` Async & Recur
        insertSequnceAsync() {
            while (this.topSequence.length > 0 && this.topSequence[0] === null) this.topSequence.shift();
            if (this.topSequence.length === 0) { this.locks.trvlLock = false; return false; }
            let num = this.topSequence.shift();
            this.messages.left = `Insert ${num}`;
            this.alertAsync(`Step 1: Search ${num}`, -1);
            this.locks.trvlLock = true;
            this.tree._hot = null; // Important: reset _hot before search
            this.searchAsync(this.tree.root(), num, (res, nodeOrHot) => {
                let recentNode = null;
                // Exception : Deal with Splay
                if ("Splay" === this.curTreeType) { // Caution & Important & TODO : May need change
                    this.alertAsync(nodeOrHot ? `Step 2: Splay at ${nodeOrHot.data}` : "", -1);
                    // Wait & Splay & Insert in callback
                    setTimeout(() => {
                        this.locks.rotateLock = true;
                        this.splayAsync(nodeOrHot, (rootOrNull) => {
                            if (!res) {
                                if (rootOrNull === undefined) return false; // `rotateLock` has been reset.
                                this.alertAsync(`Final: ${num} Inserted`, 2500);
                                if (rootOrNull === null) recentNode = this.tree.insertAsRoot(num);
                                else recentNode = this.tree.insertSplitRoot(num);  // Splay ONLY!!!
                            }
                            else { this.alertAsync(`${num} Exists`); recentNode = nodeOrHot; }
                            /* ----------------------------------- SAME BLOCK 0000 ------------------------------------------------- */
                            setTimeout(() => {
                                this.update();
                                if (this.topSequence.length === 0) {
                                    recentNode.active = true;  // Caution: Mark recent active
                                    this.locks.trvlLock = false; return false;
                                } else this.insertSequnceAsync();
                            }, this.commonParams.interval);
                            /* ----------------------------------------------------------------------------------------------------- */
                        });
                    }, this.commonParams.interval);
                }
                // Deal with Other trees
                else {
                    if (res) { this.alertAsync(`${num} Exists`); recentNode = nodeOrHot; }
                    else {
                        recentNode = this.tree.insert(num);
                        this.alertAsync(`Final: ${num} Inserted`, 2500);
                    }
                    /* ------------------------------------- SAME BLOCK 0000 ----------------------------------------------- */
                    setTimeout(() => {
                        this.update();
                        if (this.topSequence.length === 0) {
                            recentNode.active = true;  // Caution: Mark recent active
                            this.locks.trvlLock = false; return false;
                        } else this.insertSequnceAsync();
                    }, this.commonParams.interval);
                    /* ----------------------------------------------------------------------------------------------------- */
                }
            })
        },
        // Search value
        onTopSearch(num) {
            if (this.isAnyLocked()) return false;
            this.update();
            this.locks.trvlLock = true;
            this.messages.left = `Search ${num}`;

            this.tree._hot = null;  // Important: reset _hot before search
            this.searchAsync(this.tree.root(), num, (res, nodeOrHot) => {
                if (res) this.alertAsync(`${num} Found`);
                else Math.random() < 0.5 ? this.alertAsync(`${num} Not Found`) : this.alertAsync(`${num} 404`);
                if (this.curTreeType === "Splay") {  // Exception & Important : Splay
                    this.alertAsync(nodeOrHot ? `Splay at ${nodeOrHot.data}` : "", 2000);
                    setTimeout(() => {
                        this.locks.rotateLock = true;
                        this.splayAsync(nodeOrHot);
                    }, this.commonParams.interval);
                }
            });
        },
        // Search Async & Recur. Callback: (true, target) if found else (false, _hot)
        searchAsync(node, num, callback) { // Important: SET LOCK BEFORE START! 
            if (!this.locks.trvlLock || !node) {
                this.locks.trvlLock = false;
                if (typeof callback === "function") callback(false, this.tree._hot);
                return false;
            }
            node.active = true;
            if (num === node.data) {
                this.locks.trvlLock = false; {
                    if (typeof callback === "function") callback(true, node);
                    return true;
                }
            } else {
                this.tree._hot = node;  // Important: set _hot
                setTimeout(() => {
                    node.active = false;
                    node.visited = true;
                    if (num < node.data) node = node.lc;
                    else node = node.rc;
                    this.searchAsync(node, num, callback);
                }, this.commonParams.interval);
            }
        },
        // Splay Async & Recur. Callback: (null) if !v, (undefined) if locked, (_root) if success
        splayAsync(v, callback) { // Important: SET `rotateLock` BEFORE START! 
            if (!v) {
                this.locks.rotateLock = false;
                if (typeof callback === "function") callback(null);
                return false;
            }
            if (!this.locks.rotateLock) {
                if (typeof callback === "function") callback(undefined);
                return false;
            }
            let p, g;
            if ((p = v.parent) && (g = p.parent)) {
                this.tree.splayDoubleLayer(v, p, g);
            } else if (p = v.parent) {
                this.tree.splaySingleLayer(v, p);
                v.parent = null; // Important!!! Missing will cause dead loop.
            }
            if (!v.parent) {
                this.tree._root = v;
                this.update();
                v.active = true;
                this.locks.rotateLock = false;
                setTimeout(() => {
                    if (typeof callback === "function") callback(v);
                }, this.commonParams.interval);
            } else {
                this.update();
                v.active = true;
                setTimeout(() => {
                    this.splayAsync(v, callback);
                }, this.commonParams.interval);
            }
        },
        // Show help message.
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

        /****************************************/
        /*               Dragger                */
        /****************************************/
        onTreeMouseDown(event) {
            if (event.button !== 0 && event.type !== "touchstart") {
                this.isDragging = false; return false;
            }
            console.log("Start dragging")
            this.treeXY = [this.$refs.tree.offsetLeft, this.$refs.tree.offsetTop];
            switch (event.type) {
                case "mousedown": this.mouseXY = [event.clientX, event.clientY]; break;
                case "touchstart":
                    this.mouseXY = [event.touches[0].clientX, event.touches[0].clientY];
                    break;
                default: return;
            }
            this.isDragging = true;
        },
        onTPMouseMove(event) {
            if (this.isDragging) {
                let newXY;
                switch (event.type) {
                    case "mousemove": newXY = [event.clientX, event.clientY]; break;
                    case "touchmove":
                        newXY = [event.touches[0].clientX, event.touches[0].clientY];
                        break;
                    default: return;
                }
                this.$refs.tree.style.left = this.treeXY[0] + newXY[0] - this.mouseXY[0] + "px";
                this.$refs.tree.style.top = this.treeXY[1] + newXY[1] - this.mouseXY[1] + "px";
            }
        },
        onTPMouseUp(e) {
            if (this.isDragging) {
                console.log("End dragging")
                this.isDragging = false;
            }
        },

        /****************************************/
        /*              Validators              */
        /****************************************/
        assertNumber(x) {
            if (typeof x === "string") x = x.trim();
            if (x === "") return null;
            x = Number(x);
            if (isNaN(x)) return null;
            if (x > 666666666666) return 666666666666;
            if (x < -52013141516) return -52013141516;
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
        isAnyLocked() {
            for (let lock in this.locks) {
                if (this.locks[lock]) { alert("In Operation! Dont do this again!"); return true; }
            }
            return false;
        },
        checkNodeOrder(node, newV) {
            let pred, succ;
            let isLC = node.isLC || BinNode.isLC(node);
            if (node.lc === undefined) {  // External nodes
                if (isLC === true && newV > node.parent.data ||
                    isLC === true && (pred = node.parent.pred()) && newV < pred.data ||
                    isLC === false && newV < node.parent.data ||
                    isLC === false && (succ = node.parent.succ()) && newV > succ.data) {
                    this.alertAsync("Must maintain order.", 2500);
                    return false;
                }
            } else {    // Internal nodes
                if ((pred = node.pred()) && newV < pred.data ||
                    (succ = node.succ()) && newV > succ.data) {
                    this.alertAsync("Must maintain order.", 2500);
                    return false;
                }
            }
            return true;
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
            set(newV) { this.commonParams.curTreeType = newV; this.init(); } // Important
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
        },
        showExtr() {
            return true;
        },
    },
    watch: {
        tree: {
            handler() {
                console.log("Detect Change in tree.");
            },
            deep: true,
        },
        commonParams: {
            handler() {
                localStorage.commonParams = JSON.stringify(this.commonParams);
            }, deep: true
        },
    },
    mounted() {
        try { this.commonParams = JSON.parse(localStorage.commonParams); }
        catch (err) { }
        if (this.availTreeTypes[this.curTreeType] == undefined) this.curTreeType = "BST";
        this.init();
    },
});

window.tp = tp;