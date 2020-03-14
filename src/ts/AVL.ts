import { BST } from "./BST"
import { BinNode, TreeUtil, NStatus } from "./BinNode"

export class AVL<T> extends BST<T> {

    /* **************************************** */
    /*           Synchronous Methods            */
    /* **************************************** */

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
            if (!TreeUtil.avlBalanced(g)) {
                this.rotateAt(TreeUtil.tallerChild(TreeUtil.tallerChild(g)));
                break;
            } else this.updateHeight(g);
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
            if (!TreeUtil.avlBalanced(g)) this.rotateAt(TreeUtil.tallerChild(TreeUtil.tallerChild(g)));
            this.updateHeight(g);
        }
    }

    /* **************************************** */
    /*          Asynchronous Methods            */
    /* **************************************** */

    public solveRemoveUnbalanceAsync(tp: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            for (let g: BinNode<T> = this._hot; g; g = g.parent) {
                if (!tp.opLock) return reject();
                g.status = NStatus.active;
                if (!TreeUtil.avlBalanced(g)) {
                    this.rotateAt(TreeUtil.tallerChild(TreeUtil.tallerChild(g)));
                    tp.update();
                    g.status = NStatus.active;
                }
                await tp.waitAsync();
                if (!tp.opLock) return reject();
                g.status = NStatus.normal;
                this.updateHeight(g);
            }
            return resolve(true);
        })
    }

    /* **************************************** */
    /*             Static Methods               */
    /* **************************************** */

    static genSampleTree(): AVL<number> {
        let tree: AVL<number> = new AVL();
        let N: number = 5 + (Math.random() < 0.5 ? Math.ceil(Math.random() * 4) : Math.ceil(Math.random() * 15));
        for (let i: number = 0; i < N; i++) tree.insert(Math.ceil(Math.random() * 5 * N));
        return tree;
    }

    static checkValidity<T>(tree: AVL<T>): Array<any> {
        let res = BST.checkValidity(tree);
        if (!res[0]) return res;

        let status: boolean = true;
        let sequence: Array<BinNode<T>> = this.inorderTraversal(tree.root());
        let mis: BinNode<T> = null;
        for (let i = 0; i < sequence.length; i++)
            if (!TreeUtil.avlBalanced(sequence[i])) { status = false; mis = sequence[i]; break; }

        let message: string = (mis === null) ? "" : `节点${mis.data}处不满足AVL平衡!`;
        return [status, message];
    }
}

window["AVL"] = AVL;