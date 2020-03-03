import { BST } from "./BST";
import { BinNode } from "./BinNode";
class AVL extends BST {
    static avlBalanced(x) {
        let balFac = BinNode.stature(x.lc) - BinNode.stature(x.rc);
        return -2 < balFac && balFac < 2;
    }
    insert(e) {
        if (!this._root) {
            this._size++;
            return this._root = new BinNode(e);
        }
        // if e exists return
        let x = this.search(e);
        if (x)
            return x;
        x = new BinNode(e, this._hot);
        this._size++;
        (e < this._hot.data) ? this._hot.lc = x : this._hot.rc = x;
        // check upwards until fix avlUnBalanced
        this.solveInsertUnbalance();
        return x;
    }
    solveInsertUnbalance() {
        for (let g = this._hot; g; g = g.parent) {
            if (!AVL.avlBalanced(g)) {
                this.rotateAt(BinNode.tallerChild(BinNode.tallerChild(g)));
                break;
            }
            else
                this.update_height(g);
        }
    }
    remove(e) {
        let x = this.search(e);
        if (!x)
            return false;
        this.removeAt(x);
        this._size--;
        // reBalance every ancestor
        this.solveRemoveUnbalance();
        return true;
    }
    solveRemoveUnbalance() {
        for (let g = this._hot; g; g = g.parent) {
            if (!AVL.avlBalanced(g))
                this.rotateAt(BinNode.tallerChild(BinNode.tallerChild(g)));
            this.update_height(g);
        }
    }
    static genSampleTree() {
        let tree = new AVL();
        for (let i = 1; i < 20; i += 3)
            tree.insert(i);
        return tree;
    }
}
window["AVL"] = AVL;
