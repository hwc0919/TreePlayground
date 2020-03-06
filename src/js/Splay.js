import { BinNode } from "./BinNode";
import { BST } from "./BST";
export class Splay extends BST {
    splay(v) {
        if (!v)
            return null;
        let p, g;
        while ((p = v.parent) && (g = p.parent)) {
            this.splayDoubleLayer(v, p, g);
        }
        // if v not reach root
        if (p = v.parent) {
            this.splaySingleLayer(v, p);
        }
        v.parent = null;
        return v;
    }
    splayDoubleLayer(v, p, g) {
        let gg = g.parent;
        if (v == p.lc) {
            if (p == g.lc) { // zig(p) zig(g)
                this.reAttachAsLC(g, p.rc);
                this.reAttachAsLC(p, v.rc);
                this.reAttachAsRC(p, g);
                this.reAttachAsRC(v, p);
            }
            else { // zip(p) zag(g)
                this.connect34(g, v, p, g.lc, v.lc, v.rc, p.rc);
            }
        }
        else if (p == g.lc) { // zag(p) zig(g)
            this.connect34(p, v, g, p.lc, v.lc, v.rc, g.rc);
        }
        else { // zag(p) zag(g)
            this.reAttachAsRC(g, p.lc);
            this.reAttachAsRC(p, v.lc);
            this.reAttachAsLC(p, g);
            this.reAttachAsLC(v, p);
        }
        // bi-connect (vpg) & gg
        if (gg)
            (g == gg.lc) ? this.reAttachAsLC(gg, v) : this.reAttachAsRC(gg, v);
        else
            v.parent = null;
        this.update_height(g);
        this.update_height(p);
        this.update_height(v);
        return v;
    }
    splaySingleLayer(v, p) {
        if (v == p.lc) {
            this.reAttachAsLC(p, v.rc);
            this.reAttachAsRC(v, p);
        }
        else {
            this.reAttachAsRC(p, v.lc);
            this.reAttachAsLC(v, p);
        }
        this.update_height(p);
        this.update_height(v);
        return v;
    }
    search(e) {
        let v = this.searchIn(this._root, e);
        return this._root = this.splay(v ? v : this._hot);
    }
    // NEVER USED. Not sure about correctness!!!
    insert(e) {
        if (!this._root) {
            this._size++;
            return this._root = new BinNode(e);
        }
        if (e == this.search(e).data)
            return this._root;
        return this.insertSplitRoot(e);
    }
    insertSplitRoot(e) {
        let v = new BinNode(e);
        if (this._root.data < e) {
            this.reAttachAsRC(v, this._root.rc);
            this.reAttachAsLC(v, this._root);
            this._root.rc = null;
        }
        else {
            this.reAttachAsLC(v, this._root.lc);
            this.reAttachAsRC(v, this._root);
            this._root.lc = null;
        }
        this._size++;
        this.update_height_above(this._root);
        return this._root = v;
    }
    remove(e) {
        if (!this._root || e != this.search(e).data)
            return false;
        let v = this._root;
        if (!v.rc) {
            if (this._root = v.lc)
                this._root.parent = null;
        }
        else if (!v.lc) {
            if (this._root = v.rc)
                this._root.parent = null;
        }
        else {
            this._root = v.rc;
            this._root.parent = null;
            this.search(e);
            this.reAttachAsLC(this._root, v.lc);
        }
        this._size--;
        if (this._root)
            this.update_height(this._root);
        return true;
    }
}
window['Splay'] = Splay;
