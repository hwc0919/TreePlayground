export enum RBColor { Red, Black };

export class BinNode<T> {
    data: T;
    parent: BinNode<T>;
    lc: BinNode<T>;
    rc: BinNode<T>;
    height: number;
    npl: number;
    color: RBColor;
    nid: number;
    x: number = 0;
    y: number = 0;
    active: boolean = false;
    visited: boolean = false;

    static N: number = 0;

    static isRoot<T>(x: BinNode<T>): boolean {
        return !x.parent;
    }
    static isLC<T>(x: BinNode<T>): boolean {
        return x.parent && x === x.parent.lc;
    }
    static isRC<T>(x: BinNode<T>): boolean {
        return x.parent && x === x.parent.rc;
    }

    static stature<T>(x: BinNode<T>): number {
        if (x === null) return -1;
        else return x.height;
    }

    static tallerChild<T>(x: BinNode<T>): BinNode<T> {
        // assert x has grandson
        let statureL = this.stature(x.lc);
        let statureR = this.stature(x.rc);
        if (statureL > statureR) return x.lc;
        else if (statureL < statureR) return x.rc;
        else return this.isLC(x) ? x.lc : x.rc;
    }

    constructor(e: T = null, p: BinNode<T> = null, lc: BinNode<T> = null, rc: BinNode<T> = null,
        height: number = 0, npl: number = 0, c: RBColor = RBColor.Red) {
        this.data = e;
        this.parent = p;
        this.lc = lc;
        this.rc = rc;
        this.height = height;
        this.npl = npl;
        this.color = c;
        this.nid = ++BinNode.N;
    }

    public size(): number {
        let s = 1;
        if (this.lc) s += this.lc.size();
        if (this.rc) s += this.rc.size();
        return s;
    }
    public insertAsLC(e: T): BinNode<T> {
        return this.lc = new BinNode<T>(e, this);
    }
    public insertAsRC(e: T): BinNode<T> {
        return this.rc = new BinNode<T>(e, this);
    }

    // Return direct successor in inorder sequence
    public succ(): BinNode<T> {
        let s: BinNode<T> = this;
        if (s.rc) {
            s = s.rc;
            while (s.lc) s = s.lc;
        } else {
            while (BinNode.isRC(s)) s = s.parent;
            s = s.parent;
        }
        return s;
    }

    // Return direct successor in inorder sequence
    public pred(): BinNode<T> {
        let s: BinNode<T> = this;
        if (s.lc) {
            s = s.lc;
            while (s.rc) s = s.rc;
        } else {
            while (BinNode.isLC(s)) s = s.parent;
            s = s.parent;
        }
        return s;
    }
};

window['BinNode'] = BinNode;