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
    searchIn(v, e) {
        while (v && v.data != e) {
            this._hot = v;
            v = (e < v.data) ? v.lc : v.rc;
        }
        return v;
    }
    // General BST search from root
    search(e) {
        this._hot = null;
        return this.searchIn(this._root, e);
    }
    staticSearch(e) {
        this._hot = null;
        return this.searchIn(this._root, e);
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
        this._hot = w.parent; // important
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
    // A sample binary search tree, Maybe called by derived class! Use new this()
    static genSampleTree() {
        let tree = new this(Math.ceil(Math.random() * 10) + 15); // 15 ~ 25
        let N = Math.random() < 0.8 ? Math.ceil(Math.random() * 4) : Math.ceil(Math.random() * 8);
        for (let i = 0; i < N; i++) {
            tree.insert(Math.ceil(Math.random() * 20));
            tree.insert(Math.ceil(Math.random() * 20) + 20);
        }
        return tree;
    }
    static checkUnique(sequence) {
        if (sequence.length === 0)
            return true;
        let curData = sequence[0].data.toString();
        let hashMap = { curData: true };
        for (let i = 0; i < sequence.length - 1; i++) {
            curData = sequence[i + 1].data.toString();
            if (hashMap[curData])
                return false;
            hashMap[curData] = true;
        }
        return true;
    }
    static checkValidity(tree) {
        let sequence = this.inorderTraversal(tree.root());
        let status = true;
        let mis = null;
        let message;
        if (!this.checkUnique(sequence))
            message = "WARNING: 当前实现禁止重复值!";
        for (let i = 0; i < sequence.length - 1; i++) { // BugFixed0305
            if (sequence[i].data >= sequence[i + 1].data) {
                status = false;
                mis = sequence[i];
                break;
            }
        }
        message = (mis === null) ? "" : `WARNING: 节点${mis.data}处不满足顺序性!`;
        return [status, message];
    }
}
window['BST'] = BST;
