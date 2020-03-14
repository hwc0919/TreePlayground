export enum RBColor { Red, Black };
window['RBColor'] = RBColor;

export enum NStatus { normal, active, visited, deprecated };
window['NStatus'] = NStatus;


/* **************************************** */
/*            TreeUtil Macros               */
/* **************************************** */
export class TreeUtil<T> {
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

    static isBlack<T>(x: BinNode<T>): boolean {
        return !x || x.color == RBColor.Black;
    }

    static isRed<T>(x: BinNode<T>): boolean {
        return !this.isBlack(x);
    }

    static isBlackUpdated<T>(x: BinNode<T>): boolean {
        return this.stature(x.lc) == this.stature(x.rc) &&
            this.stature(x) == (this.isBlack(x) ? this.stature(x.lc) + 1 : this.stature(x.lc));
    }

    static avlBalanced<T>(x: BinNode<T>): boolean {
        let balFac: number = this.stature(x.lc) - this.stature(x.rc);
        return -2 < balFac && balFac < 2;
    }
}

window['TreeUtil'] = TreeUtil;

/* **************************************** */
/*              BinNode Class               */
/* **************************************** */

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
    status: NStatus = NStatus.normal;

    static N: number = 0;

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
            while (TreeUtil.isRC(s)) s = s.parent;
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
            while (TreeUtil.isLC(s)) s = s.parent;
            s = s.parent;
        }
        return s;
    }
};

window['BinNode'] = BinNode;