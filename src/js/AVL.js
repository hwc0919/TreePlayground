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
        let N = 5 + (Math.random() < 0.5 ? Math.ceil(Math.random() * 4) : Math.ceil(Math.random() * 10));
        for (let i = 0; i < N; i++)
            tree.insert(Math.ceil(Math.random() * 30));
        return tree;
    }
    static checkValidity(tree) {
        let res = BST.checkValidity(tree);
        if (!res[0])
            return res;
        let status = true;
        let sequence = this.inorderTraversal(tree.root());
        let mis = null;
        for (let i = 0; i < sequence.length; i++)
            if (!this.avlBalanced(sequence[i])) {
                status = false;
                mis = sequence[i];
                break;
            }
        let message = (mis === null) ? "" : `节点${mis.data}处不满足AVL平衡!`;
        return [status, message];
    }
}
window["AVL"] = AVL;
