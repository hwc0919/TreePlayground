var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BinTree } from "./BinTree";
import { NStatus, TreeUtil, BinNode } from "./BinNode";
export class BST extends BinTree {
    // 3 + 4 Reconstruction of BBST
    connect34(a, b, c, t0, t1, t2, t3) {
        this.reAttachAsLC(a, t0);
        this.reAttachAsRC(a, t1);
        this.updateHeight(a);
        this.reAttachAsLC(c, t2);
        this.reAttachAsRC(c, t3);
        this.updateHeight(c);
        this.reAttachAsLC(b, a);
        this.reAttachAsRC(b, c);
        this.updateHeight(b);
        return b;
    }
    // Rotate at the grandchild of lowest unbalanced bbst node
    rotateAt(x) {
        let p = x.parent;
        let g = p.parent;
        let gp = g.parent;
        let gIsLC = TreeUtil.isLC(g);
        if (TreeUtil.isLC(p)) {
            if (TreeUtil.isLC(x))
                x = this.connect34(x, p, g, x.lc, x.rc, p.rc, g.rc);
            else
                x = this.connect34(p, x, g, p.lc, x.lc, x.rc, g.rc);
        }
        else {
            if (TreeUtil.isLC(x))
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
    searchAsync(e, tp) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!tp.opLock) {
                reject();
                return false;
            }
            this._hot = null;
            let node = this._root;
            while (node && e != node.data) {
                if (!tp.opLock) {
                    reject();
                    return false;
                }
                node.status = NStatus.active;
                this._hot = node;
                node = yield new Promise((res) => {
                    setTimeout(() => {
                        node.status = NStatus.visited;
                        res(e < node.data ? node.lc : node.rc);
                    }, tp.commonParams.interval);
                });
            }
            if (!tp.opLock) {
                reject();
                return false;
            }
            if (node) {
                node.status = NStatus.active;
                resolve([true, node]);
            }
            else
                resolve([false, this._hot]);
            return true;
        }));
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
        this.updateHeightAbove(v);
        return v;
    }
    insertAsync(e, tp) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!tp.opLock) {
                reject();
                return false;
            }
            let srchRes = yield this.searchAsync(e, tp).catch(() => { });
            if (!tp.opLock) {
                reject();
                return false;
            }
            if (!srchRes) {
                reject();
                return false;
            }
            let [found, nodeOrHot] = srchRes;
            if (found) {
                resolve([false, nodeOrHot]);
                return false;
            }
            let v = new BinNode(e, this._hot);
            this._size++;
            if (!this._root)
                this._root = v;
            else
                (e < this._hot.data) ? this._hot.lc = v : this._hot.rc = v;
            this.updateHeightAbove(v);
            resolve([true, v]);
        }));
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
        else if (TreeUtil.isLC(w))
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
        this.updateHeightAbove(this._hot);
        return true;
    }
    // A sample binary search tree, Maybe called by derived class! Use new this()
    static genSampleTree() {
        let N = Math.random() < 0.5 ? Math.ceil(Math.random() * 8) : Math.ceil(Math.random() * 30);
        let rootV = Math.ceil(Math.random() * 30 + N);
        let tree = new this(rootV);
        for (let i = 0; i < N; i++) {
            Math.random() < 0.5 ? tree.insert(rootV - Math.ceil(Math.random() * rootV)) :
                tree.insert(rootV + Math.ceil(Math.random() * rootV));
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
