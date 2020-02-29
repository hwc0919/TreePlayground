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

    constructor(e: T = null, p: BinNode<T> = null, lc: BinNode<T> = null, rc: BinNode<T> = null,
        height: number = 0, npl: number = -1, c: RBColor = RBColor.Red, nid: number = 0) {
        this.data = e;
        this.parent = p;
        this.lc = lc;
        this.rc = rc;
        this.height = height;
        this.npl = npl;
        this.color = c;
        this.nid = nid;
    }
};

