"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Deque_1 = require("./Deque");
const BinNode_1 = require("./BinNode");
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
            extrNodes.push({ x: 0, y: 0, is_root: true });
            return structInfo;
        }
        // Level order traversal and record structure info
        let Q = new Deque_1.Deque();
        if (this._root)
            Q.push(this._root);
        while (!Q.empty()) {
            let node = Q.shift();
            nodes.push(node);
            //!!! Need to implement coordination calculation algorithm here
            let deltaL = Math.pow(2, stature(node.lc)) * 80 + node.data.toString().length * 6;
            let deltaR = Math.pow(2, stature(node.rc)) * 80 + node.data.toString().length * 6;
            let deltaY = 80;
            let nodeLCX = node.x - deltaL - (node.lc ? node.lc.data.toString().length * 6 : 0);
            let nodeRCX = node.x + deltaR + (node.rc ? node.rc.data.toString().length * 6 : 0);
            let nodeCY = node.y + deltaY;
            if (node.lc) {
                Q.push(node.lc);
                node.lc.x = nodeLCX;
                node.lc.y = nodeCY;
                // left, top, width, height
                edges[0].push([nodeLCX, node.y, node.x - nodeLCX, deltaY - 29]);
            }
            else {
                extrNodes.push({ x: nodeLCX, y: nodeCY, parent: node, is_lc: true });
                extrEdges[0].push([nodeLCX, node.y, node.x - nodeLCX, deltaY - 29]);
            }
            if (node.rc) {
                node.rc.x = nodeRCX;
                node.rc.y = nodeCY;
                Q.push(node.rc);
                edges[1].push([node.x, node.y, nodeRCX - node.x, deltaY - 29]);
            }
            else {
                extrNodes.push({ x: nodeRCX, y: nodeCY, parent: node, is_lc: false });
                extrEdges[1].push([node.x, node.y, nodeRCX - node.x, deltaY - 29]);
            }
        }
        // Return structure info object
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
window['BinNode'] = BinNode_1.BinNode;
window['BinTree'] = BinTree;
