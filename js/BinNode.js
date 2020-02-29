define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RBColor;
    (function (RBColor) {
        RBColor[RBColor["Red"] = 0] = "Red";
        RBColor[RBColor["Black"] = 1] = "Black";
    })(RBColor = exports.RBColor || (exports.RBColor = {}));
    ;
    var BinNode = /** @class */ (function () {
        function BinNode(e, p, lc, rc, height, npl, c, nid) {
            if (e === void 0) { e = null; }
            if (p === void 0) { p = null; }
            if (lc === void 0) { lc = null; }
            if (rc === void 0) { rc = null; }
            if (height === void 0) { height = 0; }
            if (npl === void 0) { npl = -1; }
            if (c === void 0) { c = RBColor.Red; }
            if (nid === void 0) { nid = 0; }
            this.data = e;
            this.parent = p;
            this.lc = lc;
            this.rc = rc;
            this.height = height;
            this.npl = npl;
            this.color = c;
            this.nid = nid;
        }
        return BinNode;
    }());
    exports.BinNode = BinNode;
    ;
});
