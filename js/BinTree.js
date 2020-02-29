var RBColor;
(function (RBColor) {
    RBColor[RBColor["Red"] = 0] = "Red";
    RBColor[RBColor["Black"] = 1] = "Black";
})(RBColor || (RBColor = {}));
;
var BinNode = /** @class */ (function () {
    function BinNode(e, p, lc, rc, height, npl, c, nid) {
        if (e === void 0) { e = null; }
        if (p === void 0) { p = null; }
        if (lc === void 0) { lc = null; }
        if (rc === void 0) { rc = null; }
        if (height === void 0) { height = 0; }
        if (npl === void 0) { npl = 0; }
        if (c === void 0) { c = RBColor.Red; }
        if (nid === void 0) { nid = 0; }
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
        this.nid = nid;
    }
    BinNode.prototype.size = function () {
        var s = 1;
        if (this.lc)
            s += this.lc.size();
        if (this.rc)
            s += this.rc.size();
        return s;
    };
    BinNode.prototype.insertAsLC = function (e) {
        return this.lc = new BinNode(e, this);
    };
    BinNode.prototype.insertAsRC = function (e) {
        return this.rc = new BinNode(e, this);
    };
    return BinNode;
}());
;
function stature(x) {
    if (x === null)
        return -1;
    else
        return x.height;
}
var BinTree = /** @class */ (function () {
    function BinTree(e) {
        if (e === void 0) { e = null; }
        if (e === null) {
            this._size = 0;
            this._root = null;
        }
        else {
            this._size = 1;
            this._root = new BinNode(e);
        }
    }
    BinTree.prototype.update_height = function (x) {
        x.height = 1 + Math.max(stature(x.lc), stature(x.rc));
        x.npl = (x.lc && x.rc) ? 1 + Math.min(x.lc.npl, x.rc.npl) : 0;
    };
    BinTree.prototype.update_height_above = function (x) {
        while (x) {
            this.update_height(x);
            x = x.parent;
        }
    };
    // readOnly methods
    BinTree.prototype.size = function () {
        return this._size;
    };
    BinTree.prototype.empty = function () {
        return !this._root;
    };
    BinTree.prototype.root = function () {
        return this._root;
    };
    // editable methods
    BinTree.prototype.remove = function (x) {
        var p = x.parent;
        if (p) {
            if (x == p.lc)
                p.lc = null;
            else
                p.rc = null;
        }
        this._size -= x.size();
        return x.size();
    };
    BinTree.prototype.insertAsRoot = function (e) {
        this._root = new BinNode(e);
        this._size = 1;
        return this._root;
    };
    BinTree.prototype.insertAsLC = function (x, e) {
        this._size++;
        x.insertAsLC(e);
        this.update_height_above(x);
        return x.lc;
    };
    BinTree.prototype.insertAsRC = function (x, e) {
        this._size++;
        x.insertAsRC(e);
        this.update_height_above(x);
        return x.rc;
    };
    BinTree.prototype.reattachAsLC = function (x, lc) {
        x.lc = x;
        if (lc)
            lc.parent = x;
    };
    BinTree.prototype.reattachAsRC = function (x, rc) {
        x.rc = x;
        if (rc)
            rc.parent = x;
    };
    BinTree.prototype.calStructInfo = function () {
        var nodes = [];
        var edges = [[], []];
        var extrNodes = [];
        var extrEdges = [[], []];
        var stk = [];
        if (this._root)
            stk.push(this._root);
        while (stk.length > 0) {
            var node = stk.pop();
            nodes.push(node);
            var deltaX = Math.pow(2, (node.npl - 1)) * 80 + node.data.toString().length * 6;
            // let deltaRCX = 2 ** (stature(node.rc)) * 80;
            var deltaY = 80;
            var nodeLCX = node.x - deltaX - (node.lc ? node.lc.data.toString().length * 6 : 0);
            var nodeRCX = node.x + deltaX + (node.rc ? node.rc.data.toString().length * 6 : 0);
            var nodeCY = node.y + deltaY;
            if (node.lc) {
                stk.push(node.lc);
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
                stk.push(node.rc);
                edges[1].push([node.x, node.y, nodeRCX - node.x, deltaY - 29]);
            }
            else {
                extrNodes.push({ x: nodeRCX, y: nodeCY, parent: node, is_lc: false });
                extrEdges[1].push([node.x, node.y, nodeRCX - node.x, deltaY - 29]);
            }
        }
        return { nodes: nodes, edges: edges, extrNodes: extrNodes, extrEdges: extrEdges };
    };
    return BinTree;
}());
var __SampleBinTree = (function () {
    var tree = new BinTree(4);
    var a = tree.insertAsLC(tree.root(), 2);
    tree.insertAsLC(a, 1);
    tree.insertAsRC(a, 3);
    a = tree.insertAsRC(tree.root(), 6);
    tree.insertAsLC(a, 5);
    tree.insertAsRC(a, 7);
    return tree;
})();
function buildFromTreeJsonObj(treeObj) {
    var dataNode = treeObj._root;
    var tree = new BinTree(treeObj._root.data);
    var dataStk = [dataNode];
    var nodeStk = [tree.root()];
    while (dataStk.length > 0) {
        dataNode = dataStk.pop();
        var node = nodeStk.pop();
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
function preorderTraversal(x) {
    var sequence = [];
    var stk = [x];
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
function inorderTraversal(x) {
    var sequence = [];
    var stk = [];
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
function postorderTraversal(x) {
    var sequence = [];
    var stk = [x];
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
