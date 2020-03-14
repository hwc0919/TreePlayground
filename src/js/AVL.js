var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BST } from "./BST";
import { BinNode, TreeUtil, NStatus } from "./BinNode";
export class AVL extends BST {
    /* **************************************** */
    /*           Synchronous Methods            */
    /* **************************************** */
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
            if (!TreeUtil.avlBalanced(g)) {
                this.rotateAt(TreeUtil.tallerChild(TreeUtil.tallerChild(g)));
                break;
            }
            else
                this.updateHeight(g);
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
            if (!TreeUtil.avlBalanced(g))
                this.rotateAt(TreeUtil.tallerChild(TreeUtil.tallerChild(g)));
            this.updateHeight(g);
        }
    }
    /* **************************************** */
    /*          Asynchronous Methods            */
    /* **************************************** */
    solveRemoveUnbalanceAsync(tp) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            for (let g = this._hot; g; g = g.parent) {
                if (!tp.opLock)
                    return reject();
                g.status = NStatus.active;
                if (!TreeUtil.avlBalanced(g)) {
                    this.rotateAt(TreeUtil.tallerChild(TreeUtil.tallerChild(g)));
                    tp.update();
                    g.status = NStatus.active;
                }
                yield tp.waitAsync();
                if (!tp.opLock)
                    return reject();
                g.status = NStatus.normal;
                this.updateHeight(g);
            }
            return resolve(true);
        }));
    }
    /* **************************************** */
    /*             Static Methods               */
    /* **************************************** */
    static genSampleTree() {
        let tree = new AVL();
        let N = 5 + (Math.random() < 0.5 ? Math.ceil(Math.random() * 4) : Math.ceil(Math.random() * 15));
        for (let i = 0; i < N; i++)
            tree.insert(Math.ceil(Math.random() * 5 * N));
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
            if (!TreeUtil.avlBalanced(sequence[i])) {
                status = false;
                mis = sequence[i];
                break;
            }
        let message = (mis === null) ? "" : `节点${mis.data}处不满足AVL平衡!`;
        return [status, message];
    }
}
window["AVL"] = AVL;
