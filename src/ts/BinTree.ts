import { Deque } from "./Deque"
import { BinNode } from "./BinNode"


interface ITreeStructInfo<T> {
    nodes: Array<BinNode<T>>;
    edges: Array<Array<Array<number>>>;
    extrNodes: Array<Object>;
    extrEdges: Array<Array<Array<number>>>;
}

interface ITreeJsonObj<T> {
    _root: BinNode<T>;
    _size: number;
    [attrName: string]: any;
}

function stature<T>(x: BinNode<T>): number {
    if (x === null) return -1;
    else return x.height;
}

export class BinTree<T> {
    protected _root: BinNode<T>;
    protected _size: number;

    constructor(e: T = null) {
        if (e === null) {
            this._size = 0;
            this._root = null;
        } else {
            this._size = 1;
            this._root = new BinNode<T>(e);
        }
    }

    protected update_height(x: BinNode<T>): void {
        x.height = 1 + Math.max(stature(x.lc), stature(x.rc));
        x.npl = (x.lc && x.rc) ? 1 + Math.min(x.lc.npl, x.rc.npl) : 0;
    }
    protected update_height_above(x: BinNode<T>): void {
        while (x) {
            this.update_height(x);
            x = x.parent;
        }
    }

    // readOnly methods
    public size(): number {
        return this._size;
    }
    public empty(): boolean {
        return !this._root;
    }
    public root(): BinNode<T> {
        return this._root;
    }

    // editable methods
    public removeBelow(x: BinNode<T>): number {
        let p = x.parent;
        // x is not root
        if (p) {
            if (x == p.lc) p.lc = null;
            else p.rc = null;
            this.update_height_above(p);
        } else  // delete root
            this._root = null;
        // update size
        this._size -= x.size();
        return x.size();
    }

    public insertAsRoot(e: T): BinNode<T> {
        this._root = new BinNode<T>(e);
        this._size = 1;
        return this._root;
    }
    public insertAsLC(x: BinNode<T>, e: T): BinNode<T> {
        this._size++;
        x.insertAsLC(e);
        this.update_height_above(x);
        return x.lc;
    }
    public insertAsRC(x: BinNode<T>, e: T): BinNode<T> {
        this._size++;
        x.insertAsRC(e);
        this.update_height_above(x);
        return x.rc;
    }
    public reAttachAsLC(x: BinNode<T>, lc: BinNode<T>): void {
        x.lc = x;
        if (lc) lc.parent = x;
    }
    public reAttachAsRC(x: BinNode<T>, rc: BinNode<T>): void {
        x.rc = x;
        if (rc) rc.parent = x;
    }

    public calStructInfo(): ITreeStructInfo<T> {
        let nodes = [];
        let edges = [[], []];
        let extrNodes = [];
        let extrEdges = [[], []];
        let structInfo = { nodes: nodes, edges: edges, extrNodes: extrNodes, extrEdges: extrEdges };

        // If emtpy tree
        if (!this._root) {
            extrNodes.push({ x: 0, y: 0, is_root: true });
            return structInfo;
        }

        // Level order traversal and record structure info
        let Q = new Deque<BinNode<T>>();
        if (this._root) Q.push(this._root);
        while (!Q.empty()) {
            let node = Q.shift();
            nodes.push(node);

            //!!! Need to implement coordination calculation algorithm here
            let deltaL = 2 ** stature(node.lc) * 80 + node.data.toString().length * 6;
            let deltaR = 2 ** stature(node.rc) * 80 + node.data.toString().length * 6;
            let deltaY = 80;

            let nodeLCX = node.x - deltaL - (node.lc ? node.lc.data.toString().length * 6 : 0);
            let nodeRCX = node.x + deltaR + (node.rc ? node.rc.data.toString().length * 6 : 0);
            let nodeCY = node.y + deltaY;
            if (node.lc) {
                Q.push(node.lc);
                node.lc.x = nodeLCX;
                node.lc.y = nodeCY;
                // left, top, width, height
                edges[0].push([nodeLCX, node.y, node.x - nodeLCX, deltaY - 29]);
            } else {
                extrNodes.push({ x: nodeLCX, y: nodeCY, parent: node, is_lc: true });
                extrEdges[0].push([nodeLCX, node.y, node.x - nodeLCX, deltaY - 29]);
            }
            if (node.rc) {
                node.rc.x = nodeRCX;
                node.rc.y = nodeCY;
                Q.push(node.rc);
                edges[1].push([node.x, node.y, nodeRCX - node.x, deltaY - 29]);
            } else {
                extrNodes.push({ x: nodeRCX, y: nodeCY, parent: node, is_lc: false });
                extrEdges[1].push([node.x, node.y, nodeRCX - node.x, deltaY - 29]);
            }
        }

        // Return structure info object
        return structInfo;
    }

    // Build tree from JSON object retracted from LocalStorage
    static buildFromTreeJsonObj<T>(treeObj: ITreeJsonObj<T>): BinTree<T> {
        if (treeObj._root === null) return new this();

        let dataNode: BinNode<T> = treeObj._root;
        let tree: BinTree<T> = new this(treeObj._root.data);
        let dataStk: Array<BinNode<T>> = [dataNode];
        let nodeStk: Array<BinNode<T>> = [tree.root()];
        while (dataStk.length > 0) {
            dataNode = dataStk.pop();
            let node = nodeStk.pop();
            if (dataNode.lc) {
                tree.insertAsLC(node, dataNode.lc.data);
                dataStk.push(dataNode.lc);
                nodeStk.push(node.lc);
            }
            if (dataNode.rc) {
                tree.insertAsRC(node, dataNode.rc.data);
                dataStk.push(dataNode.rc);
                nodeStk.push(node.rc);
            }
        }
        return tree;
    }

    // preorder Traversal and store sequence in an array.
    static preorderTraversal<T>(x: BinNode<T>): Array<BinNode<T>> {
        let sequence = [];
        let stk: Array<BinNode<T>> = [x];
        while (stk.length > 0) {
            x = stk.pop();
            while (x) {
                sequence.push(x);
                if (x.rc) stk.push(x.rc);
                x = x.lc;
            }
        }
        return sequence;
    }

    static inorderTraversal<T>(x: BinNode<T>): Array<BinNode<T>> {
        let sequence = [];
        let stk: Array<BinNode<T>> = [];
        while (x || stk.length > 0) {
            while (x) {
                stk.push(x);
                x = x.lc;
            }
            x = stk.pop();
            sequence.push(x);
            x = x.rc;
        }
        return sequence;
    }

    static postorderTraversal<T>(x: BinNode<T>): Array<BinNode<T>> {
        let sequence = [];
        let stk: Array<BinNode<T>> = [x];
        while (stk.length > 0) {
            if (x.parent != stk[stk.length - 1]) {
                x = stk[stk.length - 1];
                while (x) {
                    if (x.rc) stk.push(x.rc);
                    if (x.lc) stk.push(x.lc);
                    x = x.lc ? x.lc : x.rc;
                }
            }
            x = stk.pop();
            sequence.push(x);
        }
        return sequence;
    }


    static levelTraversal<T>(x: BinNode<T>): Array<BinNode<T>> {
        let sequence: Array<BinNode<T>> = [];
        let Q: Deque<BinNode<T>> = new Deque([x]);
        while (!Q.empty()) {
            x = Q.shift();
            sequence.push(x);
            if (x.lc) Q.push(x.lc);
            if (x.rc) Q.push(x.rc);
        }
        return sequence;
    }

    // A sample binary tree
    static genSampleTree(): BinTree<number> {
        let tree: BinTree<number> = new BinTree(1);
        let a: BinNode<number> = tree.insertAsLC(tree.root(), 2);
        tree.insertAsLC(a, 3);
        tree.insertAsRC(a, 4);
        a = tree.insertAsRC(tree.root(), 5);
        tree.insertAsLC(a, 6);
        tree.insertAsRC(a, 7);
        return tree;
    }
}

window['BinNode'] = BinNode;
window['BinTree'] = BinTree;