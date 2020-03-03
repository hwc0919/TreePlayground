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
        for (let i: number = 1; i < 20; i += 3) tree.insert(i);
        return tree;
    }
}

window["AVL"] = AVL;