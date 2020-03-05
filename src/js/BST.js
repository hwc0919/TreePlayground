import { BinTree } from "./BinTree";
import { BinNode } from "./BinNode";
export class BST extends BinTree {
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
        let gIsLC = BinNode.isLC(g);
        if (BinNode.isLC(p)) {
            if (BinNode.isLC(x))
                x = this.connect34(x, p, g, x.lc, x.rc, p.rc, g.rc);
            else
                x = this.connect34(p, x, g, p.lc, x.lc, x.rc, g.rc);
        }
        else {
            if (BinNode.isLC(x))
                x = this.connect34(g, x, p, g.lc, x.lc, x.rc, p.rc);
            else
                x = this.connect34(g, p, x, g.lc, p.lc, x.lc, x.rc);
        }
        x.parent = gp;
        if (gp)
            gIsLC ? gp.lc = x : gp.rc = x;
        else
            this._root = x;
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
        v = new BinNode(e, this._hot);
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
            x = x.rc;
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
        else if (BinNode.isLC(w))
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
        let tree = new BST(Math.ceil(Math.random() * 10) + 15); // 15 ~ 25
        let N = Math.random() < 0.8 ? Math.ceil(Math.random() * 4) : Math.ceil(Math.random() * 8);
        for (let i = 0; i < N; i++) {
            tree.insert(Math.ceil(Math.random() * 20));
            tree.insert(Math.ceil(Math.random() * 20) + 20);
        }
        return tree;
    }
    static checkValidity(tree, callback) {
        let sequence = this.inorderTraversal(tree.root());
        let res = true;
        let mis = null;
        for (let i = 0; i < sequence.length; i++)
            if (sequence[i].data >= sequence[i + 1].data) {
                res = false;
                mis = sequence[i];
                break;
            }
        let message = (mis === null) ? "" : `节点${mis.data}处不满足顺序性!`;
        if (typeof callback === "function")
            callback(res, message);
        return res;
    }
}
window['BST'] = BST;
