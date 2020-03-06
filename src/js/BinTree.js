import { Deque } from "./Deque";
import { BinNode } from "./BinNode";
let stature = BinNode.stature;
export class BinTree {
    constructor(e = null) {
        if (e === null) {
            this._size = 0;
            this._root = null;
        }
        else {
            this._size = 1;
            this._root = new BinNode(e);
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
        this._root = new BinNode(e);
        this._size = 1;
        return this._root;
    }
    insertAsLC(x, e, updateH = true) {
        this._size++;
        x.insertAsLC(e);
        if (updateH)
            this.update_height_above(x);
        return x.lc;
    }
    insertAsRC(x, e, updateH = true) {
        this._size++;
        x.insertAsRC(e);
        if (updateH)
            this.update_height_above(x);
        return x.rc;
    }
    reAttachAsLC(x, lc) {
        x.lc = lc;
        if (lc)
            lc.parent = x;
    }
    reAttachAsRC(x, rc) {
        x.rc = rc;
        if (rc)
            rc.parent = x;
    }
    // Calculate coordinates of nodes and edges! Core Function! Edit with caution!
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
        // 常数设置:
        let spacingX = 80;
        if (this._size > 20)
            spacingX = 70;
        else if (this._size > 40)
            spacingX = 65;
        let spacingY = 80;
        if (this._root.height > 10)
            spacingY = 70;
        else if (this._root.height > 20)
            spacingY = 60;
        // 逐层遍历
        this._root.y = 0;
        this._root.active = false;
        this._root.visited = false;
        let levels = [[this._root]];
        nodes.push(this._root);
        for (let i = 0; i <= this._root.height; i++) {
            levels.push([]);
            for (let j = 0; j < levels[i].length; j++) {
                let node = levels[i][j];
                let levelY = spacingY * (i + 1);
                // 为外部节点添加一个外部节点孩子
                if (node.lc === undefined) {
                    levels[i + 1].push({ x: node.x, y: levelY, parent: node });
                    continue;
                }
                node.active = false;
                node.visited = false;
                let deltaX = Math.max(0, node.data.toString().length - 2) * 6;
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
            lastLevel[j].x = lastLevel[j - 1].x + spacingX;
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
                    let leftEdge = [curLevel[j].x, jParent.y, jParent.x - curLevel[j].x, spacingY - 29];
                    if (curLevel[j].lc === undefined)
                        extrEdges[0].push(leftEdge);
                    else
                        edges[0].push(leftEdge);
                    let rightEdge = [jParent.x, jParent.y, curLevel[j + 1].x - jParent.x, spacingY - 29];
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
        let i = 0;
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
    buildFromBinSequence(sequence) {
        this.insertAsRoot(sequence[0]);
        let ind = 1;
        let Q = new Deque([this._root]);
        while (ind < sequence.length && !Q.empty()) {
            let node = Q.shift();
            if (sequence[ind] != null)
                Q.push(this.insertAsLC(node, sequence[ind]));
            ind++;
            if (sequence[ind] != null)
                Q.push(this.insertAsRC(node, sequence[ind]));
            ind++;
        }
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
        let Q = new Deque([x]);
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
    static properTraversal(x) {
        let sequence = [];
        let Q = new Deque([x]);
        while (!Q.empty()) {
            x = Q.shift();
            sequence.push(x);
            if (x) {
                Q.push(x.lc);
                Q.push(x.rc);
            }
        }
        return sequence;
    }
    // A sample binary tree
    static genSampleTree() {
        let tree = new BinTree(Math.ceil(Math.random() * 10));
        let nodes = [tree.root()];
        let N = Math.random() < 0.8 ? Math.ceil(Math.random() * 4) : Math.ceil(Math.random() * 8);
        while (N--) {
            let ind = Math.floor(Math.random() * nodes.length);
            let node = nodes[ind];
            if (!node.lc)
                nodes.push(tree.insertAsLC(node, Math.ceil(Math.random() * 20)));
            if (!node.rc)
                nodes.push(tree.insertAsRC(node, Math.ceil(Math.random() * 20)));
            nodes.splice(ind, 1);
        }
        return tree;
    }
    static checkValidity(tree) {
        return [true, ""];
    }
}
window['BinTree'] = BinTree;
