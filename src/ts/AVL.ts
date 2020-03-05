import { BST } from "./BST"
import { BinNode } from "./BinNode"

class AVL<T> extends BST<T> {

    static avlBalanced<T>(x: BinNode<T>): boolean {
        let balFac: number = BinNode.stature(x.lc) - BinNode.stature(x.rc);
        return -2 < balFac && balFac < 2;
    }

    public insert(e: T): BinNode<T> {
        if (!this._root) {
            this._size++;
            return this._root = new BinNode<T>(e);
        }

        // if e exists return
        let x: BinNode<T> = this.search(e);
        if (x) return x;

        x = new BinNode<T>(e, this._hot);
        this._size++;
        (e < this._hot.data) ? this._hot.lc = x : this._hot.rc = x;
        // check upwards until fix avlUnBalanced
        this.solveInsertUnbalance();
        return x;
    }

    public solveInsertUnbalance(): void {
        for (let g: BinNode<T> = this._hot; g; g = g.parent) {
            if (!AVL.avlBalanced(g)) {
                this.rotateAt(BinNode.tallerChild(BinNode.tallerChild(g)));
                break;
            } else this.update_height(g);
        }
    }

    public remove(e: T): boolean {
        let x: BinNode<T> = this.search(e);
        if (!x) return false;
        this.removeAt(x);
        this._size--;

        // reBalance every ancestor
        this.solveRemoveUnbalance();
        return true;
    }

    public solveRemoveUnbalance(): void {
        for (let g: BinNode<T> = this._hot; g; g = g.parent) {
            if (!AVL.avlBalanced(g)) this.rotateAt(BinNode.tallerChild(BinNode.tallerChild(g)));
            this.update_height(g);
        }
    }

    static genSampleTree(): AVL<number> {
        let tree: AVL<number> = new AVL();
        let N: number = 5 + (Math.random() < 0.5 ? Math.ceil(Math.random() * 4) : Math.ceil(Math.random() * 10));
        for (let i: number = 0; i < N; i++) tree.insert(Math.ceil(Math.random() * 30));
        return tree;
    }

    static checkValidity<T>(tree: AVL<T>, callback: Function): boolean {
        let sequence: Array<BinNode<T>> = this.inorderTraversal(tree.root());
        let res: boolean = true;
        let mis: BinNode<T> = null;
        for (let i = 0; i < sequence.length - 1; i++)
            if (sequence[i].data >= sequence[i + 1].data) { res = false; mis = sequence[i]; break; }
        let message: string = (mis === null) ? "" : `节点${mis.data}处不满足顺序性!`;
        if (res) {  // check AVL
            for (let i = 0; i < sequence.length; i++)
                if (!this.avlBalanced(sequence[i])) { res = false; mis = sequence[i]; break; }
            message = (mis === null) ? message : `节点${mis.data}处不满足AVL平衡!`;
        }
        if (typeof callback === "function") callback(res, message);
        return res;
    }
}

window["AVL"] = AVL;