var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BinNode, NStatus } from "./BinNode";
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
    splayAsync(v, tp) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!tp.opLock) {
                reject();
                return false;
            } // check lock
            if (!v) {
                tp.opLock = false;
                resolve(null);
                return false;
            }
            tp.update();
            let p, g;
            while ((p = v.parent) && (g = p.parent)) {
                v.status = NStatus.active;
                if (!tp.opLock) {
                    reject();
                    return false;
                }
                yield new Promise((res) => {
                    setTimeout(() => {
                        this.splayDoubleLayer(v, p, g);
                        res();
                    }, tp.commonParams.interval);
                });
                tp.update();
            }
            if (!tp.opLock) {
                reject();
                return false;
            }
            if (p = v.parent) {
                v.status = NStatus.active;
                yield new Promise((res) => {
                    setTimeout(() => {
                        this.splaySingleLayer(v, p);
                        res();
                    }, tp.commonParams.interval);
                });
            }
            v.parent = null;
            this._root = v;
            tp.update();
            v.status = NStatus.active;
            if (!tp.opLock) {
                reject();
                return false;
            }
            tp.opLock = false;
            resolve(v);
            return true;
        }));
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
        this.updateHeight(g);
        this.updateHeight(p);
        this.updateHeight(v);
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
        this.updateHeight(p);
        this.updateHeight(v);
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
        this.updateHeightAbove(this._root);
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
            this.updateHeight(this._root);
        return true;
    }
}
window['Splay'] = Splay;
