"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RBColor;
(function (RBColor) {
    RBColor[RBColor["Red"] = 0] = "Red";
    RBColor[RBColor["Black"] = 1] = "Black";
})(RBColor = exports.RBColor || (exports.RBColor = {}));
;
class BinNode {
    constructor(e = null, p = null, lc = null, rc = null, height = 0, npl = 0, c = RBColor.Red) {
        this.x = 0;
        this.y = 0;
        this.active = false;
        this.data = e;
        this.parent = p;
        this.lc = lc;
        this.rc = rc;
        this.height = height;
        this.npl = npl;
        this.color = c;
        this.nid = ++BinNode.N;
    }
    static isRoot(x) {
        return !x.parent;
    }
    static isLC(x) {
        return x.parent && x === x.parent.lc;
    }
    static isRC(x) {
        return x.parent && x === x.parent.rc;
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
            while (BinNode.isRC(s))
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
            while (BinNode.isLC(s))
                s = s.parent;
            s = s.parent;
        }
        return s;
    }
}
exports.BinNode = BinNode;
BinNode.N = 0;
;
window['BinNode'] = BinNode;
