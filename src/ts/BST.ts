import { BinTree } from "./BinTree"
import { BinNode, TreeUtil } from "./BinNode"


export class BST<T> extends BinTree<T> {
    protected _hot: BinNode<T>;

    // 3 + 4 Reconstruction of BBST
    protected connect34(a: BinNode<T>, b: BinNode<T>, c: BinNode<T>,
        t0: BinNode<T>, t1: BinNode<T>, t2: BinNode<T>, t3: BinNode<T>): BinNode<T> {
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
    protected rotateAt(x: BinNode<T>): BinNode<T> {
        let p: BinNode<T> = x.parent;
        let g: BinNode<T> = p.parent;
        let gp: BinNode<T> = g.parent;
        let gIsLC: boolean = TreeUtil.isLC(g);

        if (TreeUtil.isLC(p)) {
            if (TreeUtil.isLC(x)) x = this.connect34(x, p, g, x.lc, x.rc, p.rc, g.rc);
            else x = this.connect34(p, x, g, p.lc, x.lc, x.rc, g.rc);
        } else {
            if (TreeUtil.isLC(x)) x = this.connect34(g, x, p, g.lc, x.lc, x.rc, p.rc);
            else x = this.connect34(g, p, x, g.lc, p.lc, x.lc, x.rc);
        }
        x.parent = gp;
        if (gp) gIsLC ? gp.lc = x : gp.rc = x;
        else this._root = x;
        return x;
    }

    // BST binary search, only go left when strictly smaller
    protected searchIn(v: BinNode<T>, e: T) {
        while (v && v.data != e) {
            this._hot = v;
            v = (e < v.data) ? v.lc : v.rc;
        }
        return v;
    }

    // General BST search from root
    public search(e: T): BinNode<T> {
        this._hot = null;
        return this.searchIn(this._root, e);
    }

    public staticSearch(e: T): BinNode<T> { // final
        this._hot = null;
        return this.searchIn(this._root, e);
    }

    // public searchAsync(e: T, tp: any): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._hot = null;
    //         let node = this._root;
    //         if (!tp.locks.srchLock || !node) {
    //             tp.locks.srchLock = false;
    //             resolve([false, this._hot]);
    //             return false;
    //         }
    //         node.status = "active";
    //         if (num === node.data) {
    //             this.locks.trvlLock = false; {
    //                 if (typeof callback === "function") callback(true, node);
    //                 return true;
    //             }
    //         } else {
    //             this.tree._hot = node;  // Important: set _hot
    //             setTimeout(() => {
    //                 node.active = false;
    //                 node.visited = true;
    //                 if (num < node.data) node = node.lc;
    //                 else node = node.rc;
    //                 this._searchAsync(node, num, callback);
    //             }, this.commonParams.interval);
    //         }
    //     })
    // }

    public insert(e: T): BinNode<T> {
        let v: BinNode<T> = this.search(e);
        if (v) return v;
        v = new BinNode<T>(e, this._hot);
        this._size++;
        if (!this._root) this._root = v;
        else (e < this._hot.data) ? this._hot.lc = v : this._hot.rc = v;

        this.updateHeightAbove(v);
        return v;
    }

    public removeAt(x: BinNode<T>): BinNode<T> {
        let w: BinNode<T> = x;
        if (!x.lc) x = x.rc;
        else if (!x.rc) x = x.lc;
        else {
            w = w.succ();
            x.data = w.data;
            x = w.rc;
        }
        this._hot = w.parent; // important
        // bi-connect x(successor) and _hot
        if (x) x.parent = this._hot;
        if (!this._hot) this._root = x;
        else if (TreeUtil.isLC(w)) this._hot.lc = x;
        else this._hot.rc = x;
        return x;
    }

    public remove(e: T): boolean {
        let v: BinNode<T> = this.search(e);
        if (!v) return false;

        this.removeAt(v);
        this._size--;
        this.updateHeightAbove(this._hot);
        return true;
    }

    // A sample binary search tree, Maybe called by derived class! Use new this()
    static genSampleTree(): BST<number> {
        let N: number = Math.random() < 0.5 ? Math.ceil(Math.random() * 8) : Math.ceil(Math.random() * 30);
        let rootV: number = Math.ceil(Math.random() * 30 + N);
        let tree: BST<number> = new this(rootV);
        for (let i: number = 0; i < N; i++) {
            Math.random() < 0.5 ? tree.insert(rootV - Math.ceil(Math.random() * rootV)) :
                tree.insert(rootV + Math.ceil(Math.random() * rootV));
        }
        return tree;
    }

    static checkUnique<T>(sequence: Array<BinNode<T>>): boolean {
        if (sequence.length === 0) return true;
        let curData = sequence[0].data.toString();
        let hashMap = { curData: true };
        for (let i = 0; i < sequence.length - 1; i++) {
            curData = sequence[i + 1].data.toString();
            if (hashMap[curData]) return false;
            hashMap[curData] = true;
        }
        return true;
    }

    static checkValidity<T>(tree: BST<T>): Array<any> {
        let sequence: Array<BinNode<T>> = this.inorderTraversal(tree.root());
        let status: boolean = true;
        let mis: BinNode<T> = null;
        let message: string;
        if (!this.checkUnique(sequence)) message = "WARNING: 当前实现禁止重复值!"
        for (let i = 0; i < sequence.length - 1; i++) {  // BugFixed0305
            if (sequence[i].data >= sequence[i + 1].data) { status = false; mis = sequence[i]; break; }
        }
        message = (mis === null) ? "" : `WARNING: 节点${mis.data}处不满足顺序性!`;
        return [status, message];
    }
}

window['BST'] = BST;