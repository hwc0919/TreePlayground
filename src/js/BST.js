"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinTree_1 = require("./BinTree");
const BinNode_1 = require("./BinNode");
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
        let tree = new BST(4);
        let a = tree.insertAsLC(tree.root(), 2);
        tree.insertAsLC(a, 1);
        tree.insertAsRC(a, 3);
        a = tree.insertAsRC(tree.root(), 6);
        tree.insertAsLC(a, 5);
        tree.insertAsRC(a, 7);
        return tree;
    }
}
exports.BST = BST;
window['BST'] = BST;
