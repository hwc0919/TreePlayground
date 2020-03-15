import "./js/cycle.js";
import Vue from "../node_modules/vue/dist/vue.min"
import IntrBinnode from "./components/binnode.vue"
import ExtrBinnode from "./components/extr-binnode.vue"
import TopBinnode from "./components/top-binnode.vue"
import { RBColor, NStatus, TreeUtil, BinNode } from "./js/BinNode"
import { BinTree } from "./js/BinTree"
import { BST } from "./js/BST"
import { AVL } from "./js/AVL"
import { Splay } from "./js/Splay"
import { RedBlack } from "./js/RedBlack"

var tp = new Vue({
    el: "#TreePlayground",
    data: {
        availTreeTypes: { "BinTree": true, "BST": true, "AVL": true, "Splay": true, "RedBlack": true },
        treeClassMap: { "BinTree": BinTree, "BST": BST, "AVL": AVL, "Splay": Splay, "RedBlack": RedBlack },
        trees: { "BinTree": null, "BST": null, "AVL": null, "Splay": null, "RedBlack": null },
        // tree: Computed
        // curTreeClass: Computed
        // curTreeType: Computed
        structInfo: {
            nodes: [],
            extrNodes: [],
            edges: [[], []],
            extrEdges: [[], []],
        },
        topSequence: [],
        commonParams: {
            curTreeType: "BST", // Important : Always use as `this.curTreeType`.
            treeScale: 100, // in %
            interval: 500   // in ms
        },
        opLock: false,  // Operation Lock
        messages: {
            left: "", right: ""
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
            this.opLock = false;
            this.update();
            this.structInfo.nodes.forEach((node) => { node.status = NStatus.normal; });
        },
        // Update, update tree structure ONLY! Then save to LocalStorage. Please Always call explicitly!!!
        update() {
            // console.log("Update");
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
        waitAsync(time) {
            let interval = time ? time : this.commonParams.interval;
            return new Promise(async (resolve) => {
                setTimeout(() => { resolve(); }, interval);
            })
        },
        // Traversal and Display in Async way.
        async traversal(method) {
            if (this.isLocked()) return false;

            this.update();
            let sequence;
            switch (method) {
                case 0: sequence = BinTree.preorderTraversal(this.tree.root()); break;
                case 1: sequence = BinTree.inorderTraversal(this.tree.root()); break;
                case 2: sequence = BinTree.postorderTraversal(this.tree.root()); break;
                case 3: sequence = BinTree.levelTraversal(this.tree.root()); break;
            }
            // Display traversal sequence
            this.topSequence = [];
            this.messages.left = method == 0 ? "先序遍历" : (method == 1 ? "中序遍历" :
                (method == 2 ? "后续遍历" : (method == 3 ? "层次遍历" : "")));
            this.opLock = true;
            await this._printSequenceAsyc(sequence).catch(() => { this.update(); });
            this.opLock = false;
            this.messages.left = "";
        },
        // Print sequence Async & Recur, and push to `topSequence`
        _printSequenceAsyc(sequence) {
            return new Promise(async (resolve, reject) => {
                if (!this.opLock) { reject(); return false; }
                // Push data in `sequence` to `topSequence` one by one
                // Set color of node in the meantime
                while (sequence.length > 0) {
                    if (!this.opLock) { reject(); return false; }
                    let node = sequence.shift();
                    this.topSequence.push(node.data);
                    node.status = NStatus.active;

                    await this.waitAsync();
                    if (!this.opLock) { reject(); return false; }
                    node.status = NStatus.visited;
                }
                // Call `this.update()` to reset color
                await this.waitAsync(2 * this.commonParams.interval);
                this.update();

                if (!this.opLock) { reject(); return false; }
                this.opLock = false;
                resolve();
            });
        },

        /****************************************/
        /*           Events Handlers            */
        /****************************************/

        // Internal node requests for value update.  See `binnode.vue`.
        onIntrUpdate(args) {
            if (this.opLock) return false;
            let [node, updation] = args;

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
            this.showMessage(successMessage);
            node.status = NStatus.active;   // Caution: Mark recent active
        },

        // External node requests for value insertion. See `extr-binnode.vue`.
        onExtrInsert(args) {
            this.update();
            let [node, insertion, callback] = args;
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

            if (curTreeType === "AVL") {    // Caution: _hot already in position?
                this.tree.solveInsertUnbalance();   // TODO: change to async
            } else if (curTreeType === "RedBlack") {
                this.tree.solveDoubleRed(retNode);
            }
            this.update();
            retNode.status = NStatus.active;  // Caution: Mark recent active
            this.showMessage(`Insert ${insertion}`);
            if (typeof callback === "function") callback(true);
        },

        // Remove whole subtree
        onRemoveBelow(node) {
            if (this.isLocked()) return false;
            this.tree.removeBelow(node);
            this.update();
            this.showMessage(`Remove Below ${node.data}`);
        },

        // Remove one node
        async onRemoveOne(node) {
            if (this.isLocked()) return false;

            this.update(); this.opLock = true;
            let rmData = node.data;

            this.showMessage(`Remove ${rmData}`);
            if ("RedBlack" === this.curTreeType) {
                this.tree.remove(rmData);  // TODO: change to async
                this.update();
            } else if ("Splay" === this.curTreeType) {
                // Splay RM Step 1: Search and Splay
                this.alertAsync(`Step 1: Splay ${rmData}`, -1);
                node.status = NStatus.active;
                await this.waitAsync();

                let rt = await this.tree.splayAsync(node, this)
                    .catch(() => { this.alertAsync("Cancelled"); this.update(); })
                if (!rt || !this.opLock) { return this.opLock = false; }

                if (!rt.rc || !rt.rc) {  // Splay RM Step 2a
                    this.tree.removeAt(rt); this.tree._size--;
                    this.tree._size--;
                    this.alertAsync(`Final: remove ${rmData}`, 2500);
                    this.update();
                } else {
                    // Splay RM Step 2b: Search succ() and Splay
                    rt.status = NStatus.deprecated;
                    this.alertAsync(`Step 2: Elevate Succ of ${rmData}`, -1);
                    await this.waitAsync();
                    if (!this.opLock) { this.alertAsync("Cancelled"); return this.update(); }

                    let srchRes = await this.tree.searchInAsync(node.rc, rmData, this).
                        catch(() => { this.alertAsync("Cancelled"); this.update(); })
                    if (!srchRes || !this.opLock) { return this.opLock = false; }
                    let splayRes = await this.tree.splayAsync(srchRes[1], this).
                        catch(() => { this.alertAsync("Cancelled"); this.update(); });
                    if (!splayRes || !this.opLock) { return this.opLock = false; }

                    // Splay RM Step 3
                    this.alertAsync(`Final: remove ${rmData}`, 2500);
                    await this.waitAsync();
                    if (!this.opLock) { this.alertAsync("Cancelled"); return this.update(); };

                    this.tree.reAttachAsLC(this.tree.root(), rt.lc);
                    this.tree._size--;
                    this.update();
                }
            } else {  // Deal with other trees
                if (!node.lc || !node.rc) { // Other Trees: Simple Situation
                    this.tree.removeAt(node); this.tree._size--;
                    this.update();
                } else { // Other Trees: Complex situation
                    // RM Step 1: Find Succ
                    this.alertAsync(`Step 1: Find Succ`, -1);
                    let succ = node.succ();
                    node.status = NStatus.deprecated;
                    let srchRes = await this.tree.searchInAsync(node, succ.data, this).
                        catch(() => { this.alertAsync("Cancelled") });
                    if (!srchRes || !this.opLock) { return this.opLock = false; }

                    // RM Step 2: Swap with Succ
                    this.alertAsync(`Step 2: Swap with Succ`, -1);
                    this.update();
                    node.status = NStatus.deprecated;
                    succ.status = NStatus.active;
                    // Wait for interval and Swap
                    await this.waitAsync();
                    if (!this.opLock) { this.alertAsync("Cancelled"); return false; }
                    let t = node.data; node.data = succ.data; succ.data = t;
                    node.status = NStatus.active;
                    succ.status = NStatus.deprecated;

                    // RM Step 3: Remove
                    this.alertAsync(`Step 3: Remove ${t}`, 2500);
                    await this.waitAsync();
                    if (!this.opLock) { this.alertAsync("Cancelled"); return false; }
                    this.tree.removeAt(succ);
                    this.update();
                }

                // RM Final Step: solve AVL unbalance
                if ("AVL" == this.curTreeType) {
                    if (this.tree._hot) this.tree._hot.status = NStatus.active;
                    else return this.opLock = false;

                    this.alertAsync(`${rmData} Removed. AVL Rebalance`, -1);
                    await this.waitAsync();
                    if (!this.opLock) { return this.alertAsync("Cancelled"); }

                    let rebncRes = await this.tree.solveRemoveUnbalanceAsync(this).
                        catch(() => { this.alertAsync("Cancelled"); })
                    if (!rebncRes) return this.opLock = false;

                    this.alertAsync(`AVL Balanced Again.`);
                    this.update();
                }

            }
            this.opLock = false;
        },

        // Rebuild with proper traversal sequence
        onTopBuild(sequence) {
            if (this.curTreeType !== "BinTree")
                this.alertAsync("请自行保证合法性, 不合法的树会造成操作异常.", 2500);
            this.tree = this.curTreeClass.properRebuild(sequence);
            this.update();
            this.showMessage("真二叉树层次序列构建");
            let res = this.curTreeClass.checkValidity(this.tree);
            if (!res[0]) this.alertAsync(res[1], 2500);
        },

        // Insert `topSequence` by calling `insertSequnceAsync()`
        async onTopInsert(sequence) {
            if (this.isLocked()) return false;

            if ("BinTree" === this.curTreeType) { this.alertAsync("BinTree can't insert."); return false; }
            this.update();
            this.topSequence = sequence;
            this.opLock = true;
            await this._insertSequnceAsync().catch(() => { this.alertAsync("Cancelled"); });
            this.opLock = false;
        },

        // Insert one number from the top down.
        _insertOneAsync(num) {
            return new Promise(async (resolve, reject) => {
                if (!this.opLock) { reject(); return false; }

                if (!this.tree.root()) {  // Insert to Empty Tree
                    this.tree.insertAsRoot(num);
                    this.update(); return resolve(true);
                }
                this.update();

                // Insert Step 1: Search
                this.alertAsync(`Step 1: Search ${num}`, -1);
                await this.waitAsync();
                if (!tp.opLock) { return reject(); }

                let srchRes = await this.tree.searchAsync(num, this).
                    catch(() => { this.alertAsync("Cancelled"); });
                if (srchRes === undefined) return reject();
                let [found, nodeOrHot] = srchRes;
                nodeOrHot.status = NStatus.active;

                // Insert to Splay Tree
                if ("Splay" === this.curTreeType) {
                    this.alertAsync(`Step 2: Splay at ${nodeOrHot.data}`, -1);
                    await this.waitAsync();
                    if (!tp.opLock) { return reject(); }

                    let splayRes = await this.tree.splayAsync(nodeOrHot, this).catch(() => { });
                    if (!splayRes) return reject();

                    if (found) this.alertAsync(`${num} Exists`);
                    else {
                        this.alertAsync(`Step 3: Insert ${num}`, 2500);
                        await this.waitAsync();
                        if (!tp.opLock) { return reject(); }

                        nodeOrHot = this.tree.insertSplitRoot(num);
                    }
                } else {  // Insert to Other Tree
                    if (found) this.alertAsync(`${num} Exists`);
                    else {
                        this.alertAsync(`Step 2: Insert ${num}`, 2500);
                        await this.waitAsync();
                        if (!tp.opLock) { return reject(); }

                        nodeOrHot = this.tree.insertAfterSearch(num);
                        if ("AVL" == this.curTreeType)
                            this.tree.solveInsertUnbalance();
                        else if ("RedBlack" == this.curTreeType)
                            this.tree.solveDoubleRed(nodeOrHot);
                    }
                }

                this.update();
                nodeOrHot.status = NStatus.active;
                return resolve(true);
            })
        },

        // Insert `topSequence` one by one
        _insertSequnceAsync() {
            return new Promise(async (resolve, reject) => {
                while (this.topSequence.length > 0) {
                    if (!this.opLock) { this.alertAsync("Cancelled!"); return reject(); }
                    while (this.topSequence.length > 0 && this.topSequence[0] === null) this.topSequence.shift();
                    if (this.topSequence.length === 0) break;
                    let num = this.topSequence.shift();
                    this.showMessage(`Insert ${num}`);

                    let insrtRes;
                    await this._insertOneAsync(num).then(() => { insrtRes = true; }).
                        catch(() => { this.alertAsync("Insert Failed"); insrtRes = false; })
                    if (!insrtRes) { reject(); return false; }
                    await this.waitAsync();
                }
                resolve();
            })
        },

        // Search one number from top down
        async onTopSearch(num) {
            if (this.opLock) return false;
            this.opLock = true;
            this.update();
            this.messages.left = `Search ${num}`;

            let srchRes = await this.tree.searchAsync(num, this).
                catch(() => { this.update(); });
            if (!srchRes) { this.opLock = false; return false; }

            let [found, nodeOrHot] = srchRes;
            if (found) this.alertAsync(`${num} Found`);
            else Math.random() < 0.5 ? this.alertAsync(`${num} Not Found`) : this.alertAsync(`${num} 404`);

            if (this.curTreeType === "Splay") {  // Exception & Important : Splay
                await this.waitAsync();
                this.alertAsync(nodeOrHot ? `Splay at ${nodeOrHot.data}` : "", 2000);
                await this.tree.splayAsync(nodeOrHot, this).
                    catch(() => { this.alertAsync("Cancelled"); this.update(); });
            }
            this.opLock = false;
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
            // console.log("Start dragging")
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
                // console.log("End dragging")
                this.isDragging = false;
            }
        },

        /****************************************/
        /*              Validators              */
        /****************************************/
        // Assert input to be Number, else null
        assertNumber(x) {
            if (typeof x === "string") x = x.trim();
            if (x === "") return null;
            x = Number(x);
            if (isNaN(x)) return null;
            if (x > 666666666666) return 666666666666;
            if (x < -52013141516) return -52013141516;
            return x;
        },
        // Turn input string to Array<number>, seperated by comma
        strToArr(str) {
            str = str.trim();
            if (str === "") return null;
            let arr = str.split(/,|，/);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = this.assertNumber(arr[i]);
            }
            return arr;
        },
        // Check for Operation Lock, give alert
        isLocked() {
            if (this.opLock) { alert("In Operation! Dont do this again!"); return true; }
            return false;
        },
        // Check BST order if extrInsert or intrUpdate
        checkNodeOrder(node, newV) {
            let pred, succ;
            let isLC = node.isLC || TreeUtil.isLC(node);
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

        /****************************************/
        /*                Others                */
        /****************************************/
        nodeColorClass(color) {
            if (this.curTreeType === "RedBlack") return color == RBColor.Red ? "red-node" : "black-node";
            return "normal-color-node";
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
    },
    watch: {
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