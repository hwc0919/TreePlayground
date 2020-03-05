import { BinNode } from "./BinNode";
import { BST } from "./BST";

class Splay<T> extends BST<T> {
    protected splay(v: BinNode<T>): BinNode<T> {
        if (!v) return null;
        let p: BinNode<T>, g: BinNode<T>;
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

    public splayDoubleLayer(v: BinNode<T>, p: BinNode<T>, g: BinNode<T>): BinNode<T> {
        let gg: BinNode<T> = g.parent;
        if (v == p.lc) {
            if (p == g.lc) {  // zig(p) zig(g)
                this.reAttachAsLC(g, p.rc);
                this.reAttachAsLC(p, v.rc);
                this.reAttachAsRC(p, g);
                this.reAttachAsRC(v, p);
            } else {    // zip(p) zag(g)
                this.connect34(g, v, p, g.lc, v.lc, v.rc, p.rc);
            }
        } else if (p == g.lc) { // zag(p) zig(g)
            this.connect34(p, v, g, p.lc, v.lc, v.rc, g.rc);
        } else { // zag(p) zag(g)
            this.reAttachAsRC(g, p.lc);
            this.reAttachAsRC(p, v.lc);
            this.reAttachAsLC(p, g);
            this.reAttachAsLC(v, p);
        }
        // bi-connect (vpg) & gg
        if (gg) (g == gg.lc) ? this.reAttachAsLC(gg, v) : this.reAttachAsRC(gg, v);
        else v.parent = null;
        this.update_height(g);
        this.update_height(p);
        this.update_height(v);
        return v;
    }

    public splaySingleLayer(v: BinNode<T>, p: BinNode<T>): BinNode<T> {
        if (v == p.lc) { this.reAttachAsLC(p, v.rc); this.reAttachAsRC(v, p); }
        else { this.reAttachAsRC(p, v.lc); this.reAttachAsLC(v, p); }
        this.update_height(p);
        this.update_height(v);
        return v;
    }

    public search(e: T): BinNode<T> {
        let v: BinNode<T> = this.searchIn(this._root, e);
        return this._root = this.splay(v ? v : this._hot);
    }

    // NEVER USED. Not sure about correctness!!!
    public insert(e: T): BinNode<T> {
        if (!this._root) {
            this._size++;
            return this._root = new BinNode<T>(e);
        }
        if (e == this.search(e).data) return this._root;

        return this.insertSplitRoot(e);
    }

    public insertSplitRoot(e: T): BinNode<T> {
        let v: BinNode<T> = new BinNode<T>(e);

        if (this._root.data < e) {
            this.reAttachAsRC(v, this._root.rc);
            this.reAttachAsLC(v, this._root);
            this._root.rc = null;
        } else {
            this.reAttachAsLC(v, this._root.lc);
            this.reAttachAsRC(v, this._root);
            this._root.lc = null
        }
        this._size++;
        this.update_height_above(this._root);
        return this._root = v;
    }

    public remove(e: T): boolean {
        return false;
    }


}

window['Splay'] = Splay;