export var RBColor;
(function (RBColor) {
    RBColor[RBColor["Red"] = 0] = "Red";
    RBColor[RBColor["Black"] = 1] = "Black";
})(RBColor || (RBColor = {}));
;
window['RBColor'] = RBColor;
export var NStatus;
(function (NStatus) {
    NStatus[NStatus["normal"] = 0] = "normal";
    NStatus[NStatus["active"] = 1] = "active";
    NStatus[NStatus["visited"] = 2] = "visited";
    NStatus[NStatus["deprecated"] = 3] = "deprecated";
})(NStatus || (NStatus = {}));
;
window['NStatus'] = NStatus;
/* **************************************** */
/*            TreeUtil Macros               */
/* **************************************** */
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
    static isBlackUpdated(x) {
        return this.stature(x.lc) == this.stature(x.rc) &&
            this.stature(x) == (this.isBlack(x) ? this.stature(x.lc) + 1 : this.stature(x.lc));
    }
    static avlBalanced(x) {
        let balFac = this.stature(x.lc) - this.stature(x.rc);
        return -2 < balFac && balFac < 2;
    }
}
window['TreeUtil'] = TreeUtil;
/* **************************************** */
/*              BinNode Class               */
/* **************************************** */
export class BinNode {
    constructor(e = null, p = null, lc = null, rc = null, height = 0, npl = 0, c = RBColor.Red) {
        this.x = 0;
        this.y = 0;
        this.status = NStatus.normal;
        this.data = e;
        this.parent = p;
        this.lc = lc;
        this.rc = rc;
        this.height = height;
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
