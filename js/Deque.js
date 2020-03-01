var Deque = /** @class */ (function () {
    function Deque() {
        this._elem_in = [];
        this._elem_out = [];
    }
    Deque.prototype.size = function () { return this._elem_in.length + this._elem_out.length; };
    Deque.prototype.empty = function () { return this.size() === 0; };
    Deque.prototype.push = function (e) {
        this._elem_in.push(e);
    };
    Deque.prototype.unshift = function (e) {
        this._elem_out.push(e);
    };
    Deque.prototype.pop = function () {
        if (this._elem_in.length === 0) {
            this._elem_in = this._elem_out;
            this._elem_in.reverse();
            this._elem_out = [];
        }
        return this._elem_in.pop();
    };
    Deque.prototype.shift = function () {
        if (this._elem_out.length === 0) {
            this._elem_out = this._elem_in;
            this._elem_out.reverse();
            this._elem_in = [];
        }
        return this._elem_out.pop();
    };
    return Deque;
}());
