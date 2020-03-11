import { Deque } from "./Deque"
import { BinNode, TreeUtil, RBColor } from "./BinNode"


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

interface IExtrNodeObj<T> {
    x: number;
    y: number;
    parent: BinNode<T>;
    isRoot?: boolean;
    isLC?: boolean;
    lc?: BinNode<T>;
}

let stature: Function = TreeUtil.stature;

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
            this._root.color = RBColor.Black;
        }
    }

    protected updateHeight(x: BinNode<T>): void {
        x.height = 1 + Math.max(stature(x.lc), stature(x.rc));
        x.npl = (x.lc && x.rc) ? 1 + Math.min(x.lc.npl, x.rc.npl) : 0;
    }
    protected updateHeightAbove(x: BinNode<T>): void {
        while (x) {
            this.updateHeight(x);
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
            this.updateHeightAbove(p);
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
    public insertAsLC(x: BinNode<T>, e: T, updateH: boolean = true): BinNode<T> {
        this._size++;
        x.insertAsLC(e);
        if (updateH) this.updateHeightAbove(x);
        return x.lc;
    }
    public insertAsRC(x: BinNode<T>, e: T, updateH: boolean = true): BinNode<T> {
        this._size++;
        x.insertAsRC(e);
        if (updateH) this.updateHeightAbove(x);
        return x.rc;
    }

    public reAttachAsLC(x: BinNode<T>, lc: BinNode<T>): void {
        x.lc = lc;
        if (lc) lc.parent = x;
    }
    public reAttachAsRC(x: BinNode<T>, rc: BinNode<T>): void {
        x.rc = rc;
        if (rc) rc.parent = x;
    }

    // Calculate coordinates of nodes and edges! Core Function! Edit with caution!
    public calStructInfo(): ITreeStructInfo<T> {
        let nodes = [];
        let edges = [[], []];
        let extrNodes = [];
        let extrEdges = [[], []];
        let structInfo = { nodes: nodes, edges: edges, extrNodes: extrNodes, extrEdges: extrEdges };
        // If emtpy tree
        if (!this._root) {
            extrNodes.push({ x: 0, y: 0, isRoot: true });
            return structInfo;
        }

        // 常数设置:
        let spacingX: number = 80;
        if (this._size > 20) spacingX = 70;
        else if (this._size > 40) spacingX = 65;
        let spacingY: number = 80;
        if (this._root.height > 10) spacingY = 70;
        else if (this._root.height > 20) spacingY = 60;

        // 逐层遍历
        this._root.y = 0;
        this._root.active = false;
        this._root.visited = false;
        let levels: Array<Array<BinNode<T>>> | any = [[this._root]];
        nodes.push(this._root);
        for (let i: number = 0;; i++) {
            let reachBottom: boolean = true;
            levels.push([]);
            for (let j: number = 0; j < levels[i].length; j++) {
                let node: any = levels[i][j];
                let levelY = spacingY * (i + 1);
                // 为外部节点添加一个外部节点孩子
                if (node.lc === undefined) {
                    levels[i + 1].push({ x: node.x, y: levelY, parent: node });
                    continue;
                }
                node.active = false;
                node.visited = false;

                let deltaX = Math.max(0, node.data.toString().length - 2) * 6;
                // 为内部节点添加两个孩子
                if (node.lc) {
                    reachBottom = false;
                    node.lc.x = node.x - deltaX;
                    node.lc.y = levelY;
                    levels[i + 1].push(node.lc);
                    nodes.push(node.lc);
                }
                else {
                    let extrNodeObj: IExtrNodeObj<T> = { x: node.x - deltaX, y: levelY, parent: node, isLC: true }
                    levels[i + 1].push(extrNodeObj);
                    extrNodes.push(extrNodeObj);
                }
                if (node.rc) {
                    reachBottom = false;
                    node.rc.x = node.x + deltaX;
                    node.rc.y = levelY;
                    levels[i + 1].push(node.rc);
                    nodes.push(node.rc);
                }
                else {
                    let extrNodeObj: IExtrNodeObj<T> = { x: node.x + deltaX, y: levelY, parent: node, isLC: false }
                    levels[i + 1].push(extrNodeObj);
                    extrNodes.push(extrNodeObj);
                }
            }
            if (reachBottom) break;
        }

        // 计算最底层横坐标
        let lastLevel = levels[levels.length - 1];
        let deltaL: number;
        let deltaR: number = lastLevel[1].x - lastLevel[0].x;
        for (let j: number = 1; j < lastLevel.length; j++) {
            deltaL = deltaR;
            deltaR = j < lastLevel.length - 1 ? lastLevel[j + 1].x - lastLevel[j].x : 0;
            lastLevel[j].x = lastLevel[j - 1].x + spacingX
            // if (lastLevel[j - 1].parent == lastLevel[j].parent) { lastLevel[j].x += deltaL }
            if (deltaL > 0) { lastLevel[j].x += deltaL }
        }

        // 逐层反推横坐标
        for (let i: number = levels.length - 1; i >= 1; i--) {
            let curLevel = levels[i];
            for (let j: number = 0; j < curLevel.length;) {
                // 父亲是内部节点
                let jParent: BinNode<T> = curLevel[j].parent;
                if (j < curLevel.length - 1 && jParent == curLevel[j + 1].parent) {
                    jParent.x = Math.floor((curLevel[j].x + curLevel[j + 1].x) / 2);
                    j += 2;
                } else { // parent is also external node
                    curLevel[j].parent.x = curLevel[j].x;
                    j++;
                }
            }
        }

        // 调整根节点至中心, 顺便更新高度(若不更新, 黑高度将错误)
        let deltaX = this._root.x;
        this._root.x = 0;
        for (let i: number = levels.length - 1; i >= 1; i--) {
            let curLevel = levels[i];
            for (let j: number = 0; j < curLevel.length; j++) {
                curLevel[j].x -= deltaX;
                if (curLevel[j].lc !== undefined) { this.updateHeight(curLevel[j]); }
            }
        }
        this.updateHeight(this._root);

        // 添加内部边和外部边
        for (let i: number = levels.length - 1; i >= 1; i--) {
            let curLevel = levels[i];
            for (let j: number = 0; j < curLevel.length;) {
                // 仅当父亲是内部节点时添加边
                let jParent: BinNode<T> = curLevel[j].parent;
                if (j < curLevel.length - 1 && jParent == curLevel[j + 1].parent) {
                    let leftEdge: Array<number> = [curLevel[j].x, jParent.y, jParent.x - curLevel[j].x, spacingY - 29];
                    if (curLevel[j].lc === undefined) extrEdges[0].push(leftEdge);
                    else edges[0].push(leftEdge);
                    let rightEdge: Array<number> = [jParent.x, jParent.y, curLevel[j + 1].x - jParent.x, spacingY - 29];
                    if (curLevel[j + 1].lc === undefined) extrEdges[1].push(rightEdge);
                    else edges[1].push(rightEdge);
                    j += 2;
                } else j++;
            }
        }
        return structInfo;
    }

    // Build tree from JSON object retracted from LocalStorage. ! Caution: Can not update Black Height!
    static buildFromTreeJsonObj<T>(treeObj: ITreeJsonObj<T>): BinTree<T> {
        if (treeObj._root === null) return new this();

        let tree: BinTree<T> = new this(treeObj._root.data);
        let dataStk: Array<BinNode<T>> = [treeObj._root];
        let nodeStk: Array<BinNode<T>> = [tree.root()];

        while (dataStk.length > 0) {
            let dataNode: BinNode<T> = dataStk.pop();
            let node: BinNode<T> = nodeStk.pop();
            if (dataNode.lc) {
                (tree.insertAsLC(node, dataNode.lc.data)).color = dataNode.lc.color;
                dataStk.push(dataNode.lc);
                nodeStk.push(node.lc);
            }
            if (dataNode.rc) {
                (tree.insertAsRC(node, dataNode.rc.data)).color = dataNode.rc.color;
                dataStk.push(dataNode.rc);
                nodeStk.push(node.rc);
            }
        }
        return tree;
    }

    public buildFromBinSequence(sequence: Array<T>): void {
        this.insertAsRoot(sequence[0]);
        let ind = 1;
        let Q: Deque<BinNode<T>> = new Deque([this._root]);
        while (ind < sequence.length && !Q.empty()) {
            let node = Q.shift();
            if (sequence[ind] != null) Q.push(this.insertAsLC(node, sequence[ind]));
            ind++;
            if (sequence[ind] != null) Q.push(this.insertAsRC(node, sequence[ind]));
            ind++;
        }
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
    static properTraversal<T>(x: BinNode<T>): Array<BinNode<T>> {
        let sequence: Array<BinNode<T>> = [];
        let Q: Deque<BinNode<T>> = new Deque([x]);
        while (!Q.empty()) {
            x = Q.shift();
            sequence.push(x);
            if (x) { Q.push(x.lc); Q.push(x.rc); }
        }
        return sequence;
    }

    // A sample binary tree
    static genSampleTree(): BinTree<number> {
        let tree: BinTree<number> = new BinTree(Math.ceil(Math.random() * 20));
        let nodes: Array<BinNode<number>> = [tree.root()];
        let N: number = Math.random() < 0.5 ? Math.ceil(Math.random() * 4) : Math.ceil(Math.random() * 15);

        for (let i: number = 0; i < N; i++) {
            let ind: number = Math.floor(Math.random() * nodes.length);
            let node: BinNode<number> = nodes[ind];
            if (!node.lc) nodes.push(tree.insertAsLC(node, Math.ceil(Math.random() * 5 * N)));
            if (!node.rc) nodes.push(tree.insertAsRC(node, Math.ceil(Math.random() * 5 * N)));
            nodes.splice(ind, 1);
        }
        return tree;
    }

    static checkValidity<T>(tree: BinTree<T>): Array<any> {
        return [true, ""];
    }
}

window['BinTree'] = BinTree;