export var RBColor;
(function (RBColor) {
    RBColor[RBColor["Red"] = 0] = "Red";
    RBColor[RBColor["Black"] = 1] = "Black";
})(RBColor || (RBColor = {}));
;
export class TreeUtil {
    static isRoot(x) {
        return !x.parent;
    }
    static isLC(x) {
        return x.parent && x === x.parent.lc;
    }
    static isRC(x) {
        return x.parent && x === x.parent.rc;
    }
    static stature(x) {
        if (x === null)
            return -1;
        else
            return x.height;
    }
    static tallerChild(x) {
        // assert x has grandson
        let statureL = this.stature(x.lc);
        let statureR = this.stature(x.rc);
        if (statureL > statureR)
            return x.lc;
        else if (statureL < statureR)
            return x.rc;
        else
            return this.isLC(x) ? x.lc : x.rc;
    }
    static isBlack(x) {
        return !x || x.color == RBColor.Black;
    }
    static isRed(x) {
        return !this.isBlack(x);
    }
    static statureB(x) {
        if (x === null)
            return -1;
        else
            return x.blackH;
    }
    static isBlackUpdated(x) {
        return this.statureB(x.lc) == this.statureB(x.rc) &&
            this.statureB(x) == (this.isBlack(x) ? this.statureB(x.lc) + 1 : this.statureB(x.lc));
    }
}
export class BinNode {
    constructor(e = null, p = null, lc = null, rc = null, height = 0, blackH = -1, npl = 0, c = RBColor.Red) {
        this.x = 0;
        this.y = 0;
        this.active = false;
        this.visited = false;
        this.data = e;
        this.parent = p;
        this.lc = lc;
        this.rc = rc;
        this.height = height;
        this.blackH = blackH;
        this.npl = npl;
        this.color = c;
        this.nid = ++BinNode.N;
    }
    size() {
        let s = 1;
        if (this.lc)
            s += this.lc.size();
        if (this.rc)
            s += this.rc.size();
        return s;
    }
    insertAsLC(e) {
        return this.lc = new BinNode(e, this);
    }
    insertAsRC(e) {
        return this.rc = new BinNode(e, this);
    }
    // Return direct successor in inorder sequence
    succ() {
        let s = this;
        if (s.rc) {
            s = s.rc;
            while (s.lc)
                s = s.lc;
        }
        else {
            while (TreeUtil.isRC(s))
                s = s.parent;
            s = s.parent;
        }
        return s;
    }
    // Return direct successor in inorder sequence
    pred() {
        let s = this;
        if (s.lc) {
            s = s.lc;
            while (s.rc)
                s = s.rc;
        }
        else {
            while (TreeUtil.isLC(s))
                s = s.parent;
            s = s.parent;
        }
        return s;
    }
}
BinNode.N = 0;
;
window['BinNode'] = BinNode;
