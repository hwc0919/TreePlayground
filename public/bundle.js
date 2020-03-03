/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Deque_1 = __webpack_require__(2);
const BST_1 = __webpack_require__(3);
const BinTree_1 = __webpack_require__(4);
Deque_1.Deque;
BinTree_1.BinTree;
BST_1.BST;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Deque {
    constructor(e = null) {
        if (!e || e.length === 0)
            this._elem_in = [];
        else
            this._elem_in = e;
        this._elem_out = [];
    }
    size() { return this._elem_in.length + this._elem_out.length; }
    empty() { return this.size() === 0; }
    push(e) {
        this._elem_in.push(e);
    }
    unshift(e) {
        this._elem_out.push(e);
    }
    pop() {
        if (this._elem_in.length === 0) {
            this._elem_in = this._elem_out;
            this._elem_in.reverse();
            this._elem_out = [];
        }
        return this._elem_in.pop();
    }
    shift() {
        if (this._elem_out.length === 0) {
            this._elem_out = this._elem_in;
            this._elem_out.reverse();
            this._elem_in = [];
        }
        return this._elem_out.pop();
    }
}
exports.Deque = Deque;
window['Deque'] = Deque;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BinTree_1 = __webpack_require__(4);
const BinNode_1 = __webpack_require__(5);
class BST extends BinTree_1.BinTree {
    // 3 + 4 Reconstruction of BBST
    connect34(a, b, c, t0, t1, t2, t3) {
        this.reAttachAsLC(a, t0);
        this.reAttachAsRC(a, t1);
        this.update_height(a);
        this.reAttachAsLC(c, t2);
        this.reAttachAsRC(c, t3);
        this.update_height(c);
        this.reAttachAsLC(b, a);
        this.reAttachAsRC(b, c);
        this.update_height(b);
        return b;
    }
    // Rotate at the grandchild of lowest unbalanced bbst node
    rotateAt(x) {
        let p = x.parent;
        let g = p.parent;
        let gp = g.parent;
        let gIsLC = BinNode_1.BinNode.isLC(g);
        if (BinNode_1.BinNode.isLC(p)) {
            if (BinNode_1.BinNode.isLC(x))
                x = this.connect34(x, p, g, x.lc, x.rc, p.rc, g.rc);
            else
                x = this.connect34(p, x, g, p.lc, x.lc, x.rc, g.rc);
        }
        else {
            if (BinNode_1.BinNode.isLC(x))
                x = this.connect34(g, x, p, g.lc, x.lc, x.rc, p.rc);
            else
                x = this.connect34(g, p, x, g.lc, p.lc, x.lc, x.rc);
        }
        x.parent = gp;
        if (gp)
            gIsLC ? gp.lc = x : gp.rc = x;
        return x;
    }
    // BST binary search, only go left when strictly smaller
    search(e) {
        let v = this._root;
        this._hot = null;
        while (v && v.data != e) {
            this._hot = v;
            v = (e < v.data) ? v.lc : v.rc;
        }
        return v;
    }
    insert(e) {
        let v = this.search(e);
        if (v)
            return v;
        v = new BinNode_1.BinNode(e, this._hot);
        this._size++;
        if (!this._root)
            this._root = v;
        else
            (e < this._hot.data) ? this._hot.lc = v : this._hot.rc = v;
        this.update_height_above(v);
        return v;
    }
    removeAt(x) {
        let w = x;
        if (!x.lc)
            x = x.lc;
        else if (!x.rc)
            x = x.lc;
        else {
            w = w.succ();
            x.data = w.data;
            x = w.rc;
        }
        this._hot = w.parent;
        // bi-connect x(successor) and _hot
        if (x)
            x.parent = this._hot;
        if (!this._hot)
            this._root = x;
        else if (BinNode_1.BinNode.isLC(w))
            this._hot.lc = x;
        else
            this._hot.rc = x;
        return x;
    }
    remove(e) {
        let v = this.search(e);
        if (!v)
            return false;
        this.removeAt(v);
        this._size--;
        this.update_height_above(this._hot);
        return true;
    }
    // A sample binary search tree
    static genSampleTree() {
        let tree = new BST(10);
        let a = tree.insertAsLC(tree.root(), 5);
        tree.insertAsLC(a, 2);
        tree.insertAsRC(a, 7);
        a = tree.insertAsRC(tree.root(), 16);
        tree.insertAsLC(a, 12);
        tree.insertAsRC(a, 20);
        return tree;
    }
}
exports.BST = BST;
window['BST'] = BST;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Deque_1 = __webpack_require__(2);
const BinNode_1 = __webpack_require__(5);
function stature(x) {
    if (x === null)
        return -1;
    else
        return x.height;
}
class BinTree {
    constructor(e = null) {
        if (e === null) {
            this._size = 0;
            this._root = null;
        }
        else {
            this._size = 1;
            this._root = new BinNode_1.BinNode(e);
        }
    }
    update_height(x) {
        x.height = 1 + Math.max(stature(x.lc), stature(x.rc));
        x.npl = (x.lc && x.rc) ? 1 + Math.min(x.lc.npl, x.rc.npl) : 0;
    }
    update_height_above(x) {
        while (x) {
            this.update_height(x);
            x = x.parent;
        }
    }
    // readOnly methods
    size() {
        return this._size;
    }
    empty() {
        return !this._root;
    }
    root() {
        return this._root;
    }
    // editable methods
    removeBelow(x) {
        let p = x.parent;
        // x is not root
        if (p) {
            if (x == p.lc)
                p.lc = null;
            else
                p.rc = null;
            this.update_height_above(p);
        }
        else // delete root
            this._root = null;
        // update size
        this._size -= x.size();
        return x.size();
    }
    insertAsRoot(e) {
        this._root = new BinNode_1.BinNode(e);
        this._size = 1;
        return this._root;
    }
    insertAsLC(x, e) {
        this._size++;
        x.insertAsLC(e);
        this.update_height_above(x);
        return x.lc;
    }
    insertAsRC(x, e) {
        this._size++;
        x.insertAsRC(e);
        this.update_height_above(x);
        return x.rc;
    }
    reAttachAsLC(x, lc) {
        x.lc = x;
        if (lc)
            lc.parent = x;
    }
    reAttachAsRC(x, rc) {
        x.rc = x;
        if (rc)
            rc.parent = x;
    }
    calStructInfo() {
        let nodes = [];
        let edges = [[], []];
        let extrNodes = [];
        let extrEdges = [[], []];
        let structInfo = { nodes: nodes, edges: edges, extrNodes: extrNodes, extrEdges: extrEdges };
        // If emtpy tree
        if (!this._root) {
            extrNodes.push({ x: 0, y: 0, isRoot: true });
            return structInfo;
        }
        // 逐层遍历
        this._root.y = 0;
        let levels = [[this._root]];
        nodes.push(this._root);
        for (let i = 0; i <= this._root.height; i++) {
            levels.push([]);
            for (let j = 0; j < levels[i].length; j++) {
                let node = levels[i][j];
                let levelY = 80 * (i + 1);
                // 为外部节点添加一个外部节点孩子
                if (node.lc === undefined) {
                    levels[i + 1].push({ x: node.x, y: levelY, parent: node });
                    continue;
                }
                let deltaX = (node.data.toString().length - 1) * 6;
                // 为内部节点添加两个孩子
                if (node.lc) {
                    node.lc.x = node.x - deltaX;
                    node.lc.y = levelY;
                    levels[i + 1].push(node.lc);
                    nodes.push(node.lc);
                }
                else {
                    let extrNodeObj = { x: node.x - deltaX, y: levelY, parent: node, isLC: true };
                    levels[i + 1].push(extrNodeObj);
                    extrNodes.push(extrNodeObj);
                }
                if (node.rc) {
                    node.rc.x = node.x + deltaX;
                    node.rc.y = levelY;
                    levels[i + 1].push(node.rc);
                    nodes.push(node.rc);
                }
                else {
                    let extrNodeObj = { x: node.x + deltaX, y: levelY, parent: node, isLC: false };
                    levels[i + 1].push(extrNodeObj);
                    extrNodes.push(extrNodeObj);
                }
            }
        }
        // 计算最底层横坐标
        let lastLevel = levels[levels.length - 1];
        let deltaL;
        let deltaR = lastLevel[1].x - lastLevel[0].x;
        for (let j = 1; j < lastLevel.length; j++) {
            deltaL = deltaR;
            deltaR = j < lastLevel.length - 1 ? lastLevel[j + 1].x - lastLevel[j].x : 0;
            lastLevel[j].x = lastLevel[j - 1].x + 80;
            // if (lastLevel[j - 1].parent == lastLevel[j].parent) { lastLevel[j].x += deltaL }
            if (deltaL > 0) {
                lastLevel[j].x += deltaL;
            }
        }
        // 逐层反推横坐标
        for (let i = levels.length - 1; i >= 1; i--) {
            let curLevel = levels[i];
            for (let j = 0; j < curLevel.length;) {
                // 父亲是内部节点
                let jParent = curLevel[j].parent;
                if (j < curLevel.length - 1 && jParent == curLevel[j + 1].parent) {
                    jParent.x = Math.floor((curLevel[j].x + curLevel[j + 1].x) / 2);
                    j += 2;
                }
                else { // parent is also external node
                    curLevel[j].parent.x = curLevel[j].x;
                    j++;
                }
            }
        }
        // 调整根节点至中心
        let deltaX = this._root.x;
        this._root.x = 0;
        for (let i = levels.length - 1; i >= 1; i--) {
            let curLevel = levels[i];
            for (let j = 0; j < curLevel.length; j++)
                curLevel[j].x -= deltaX;
        }
        // 添加内部边和外部边
        for (let i = levels.length - 1; i >= 1; i--) {
            let curLevel = levels[i];
            for (let j = 0; j < curLevel.length;) {
                // 仅当父亲是内部节点时添加边
                let jParent = curLevel[j].parent;
                if (j < curLevel.length - 1 && jParent == curLevel[j + 1].parent) {
                    let leftEdge = [curLevel[j].x, jParent.y, jParent.x - curLevel[j].x, 51];
                    if (curLevel[j].lc === undefined)
                        extrEdges[0].push(leftEdge);
                    else
                        edges[0].push(leftEdge);
                    let rightEdge = [jParent.x, jParent.y, curLevel[j + 1].x - jParent.x, 51];
                    if (curLevel[j + 1].lc === undefined)
                        extrEdges[1].push(rightEdge);
                    else
                        edges[1].push(rightEdge);
                    j += 2;
                }
                else
                    j++;
            }
        }
        return structInfo;
    }
    // Build tree from JSON object retracted from LocalStorage
    static buildFromTreeJsonObj(treeObj) {
        if (treeObj._root === null)
            return new this();
        let dataNode = treeObj._root;
        let tree = new this(treeObj._root.data);
        let dataStk = [dataNode];
        let nodeStk = [tree.root()];
        while (dataStk.length > 0) {
            dataNode = dataStk.pop();
            let node = nodeStk.pop();
            if (dataNode.lc) {
                tree.insertAsLC(node, dataNode.lc.data);
                dataStk.push(dataNode.lc);
                nodeStk.push(node.lc);
            }
            if (dataNode.rc) {
                tree.insertAsRC(node, dataNode.rc.data);
                dataStk.push(dataNode.rc);
                nodeStk.push(node.rc);
            }
        }
        return tree;
    }
    // preorder Traversal and store sequence in an array.
    static preorderTraversal(x) {
        let sequence = [];
        let stk = [x];
        while (stk.length > 0) {
            x = stk.pop();
            while (x) {
                sequence.push(x);
                if (x.rc)
                    stk.push(x.rc);
                x = x.lc;
            }
        }
        return sequence;
    }
    static inorderTraversal(x) {
        let sequence = [];
        let stk = [];
        while (x || stk.length > 0) {
            while (x) {
                stk.push(x);
                x = x.lc;
            }
            x = stk.pop();
            sequence.push(x);
            x = x.rc;
        }
        return sequence;
    }
    static postorderTraversal(x) {
        let sequence = [];
        let stk = [x];
        while (stk.length > 0) {
            if (x.parent != stk[stk.length - 1]) {
                x = stk[stk.length - 1];
                while (x) {
                    if (x.rc)
                        stk.push(x.rc);
                    if (x.lc)
                        stk.push(x.lc);
                    x = x.lc ? x.lc : x.rc;
                }
            }
            x = stk.pop();
            sequence.push(x);
        }
        return sequence;
    }
    static levelTraversal(x) {
        let sequence = [];
        let Q = new Deque_1.Deque([x]);
        while (!Q.empty()) {
            x = Q.shift();
            sequence.push(x);
            if (x.lc)
                Q.push(x.lc);
            if (x.rc)
                Q.push(x.rc);
        }
        return sequence;
    }
    // A sample binary tree
    static genSampleTree() {
        let tree = new BinTree(1);
        let a = tree.insertAsLC(tree.root(), 2);
        tree.insertAsLC(a, 3);
        tree.insertAsRC(a, 4);
        a = tree.insertAsRC(tree.root(), 5);
        tree.insertAsLC(a, 6);
        tree.insertAsRC(a, 7);
        return tree;
    }
}
exports.BinTree = BinTree;
window['BinTree'] = BinTree;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RBColor;
(function (RBColor) {
    RBColor[RBColor["Red"] = 0] = "Red";
    RBColor[RBColor["Black"] = 1] = "Black";
})(RBColor = exports.RBColor || (exports.RBColor = {}));
;
class BinNode {
    constructor(e = null, p = null, lc = null, rc = null, height = 0, npl = 0, c = RBColor.Red) {
        this.x = 0;
        this.y = 0;
        this.active = false;
        this.data = e;
        this.parent = p;
        this.lc = lc;
        this.rc = rc;
        this.height = height;
        this.npl = npl;
        this.color = c;
        this.nid = ++BinNode.N;
    }
    static isRoot(x) {
        return !x.parent;
    }
    static isLC(x) {
        return x.parent && x === x.parent.lc;
    }
    static isRC(x) {
        return x.parent && x === x.parent.rc;
    }
    size() {
        let s = 1;
        if (this.lc)
            s += this.lc.size();
        if (this.rc)
            s += this.rc.size();
        return s;
    }
    insertAsLC(e) {
        return this.lc = new BinNode(e, this);
    }
    insertAsRC(e) {
        return this.rc = new BinNode(e, this);
    }
    // Return direct successor in inorder sequence
    succ() {
        let s = this;
        if (s.rc) {
            s = s.rc;
            while (s.lc)
                s = s.lc;
        }
        else {
            while (BinNode.isRC(s))
                s = s.parent;
            s = s.parent;
        }
        return s;
    }
    // Return direct successor in inorder sequence
    pred() {
        let s = this;
        if (s.lc) {
            s = s.lc;
            while (s.rc)
                s = s.rc;
        }
        else {
            while (BinNode.isLC(s))
                s = s.parent;
            s = s.parent;
        }
        return s;
    }
}
exports.BinNode = BinNode;
BinNode.N = 0;
;
window['BinNode'] = BinNode;


/***/ })
/******/ ]);