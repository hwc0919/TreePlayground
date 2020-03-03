export class Deque {
    constructor(e = null) {
        if (!e || e.length === 0)
            this._elem_in = [];
        else
            this._elem_in = e;
        this._elem_out = [];
    }
    size() { return this._elem_in.length + this._elem_out.length; }
    empty() { return this.size() === 0; }
    push(e) {
        this._elem_in.push(e);
    }
    unshift(e) {
        this._elem_out.push(e);
    }
    pop() {
        if (this._elem_in.length === 0) {
            this._elem_in = this._elem_out;
            this._elem_in.reverse();
            this._elem_out = [];
        }
        return this._elem_in.pop();
    }
    shift() {
        if (this._elem_out.length === 0) {
            this._elem_out = this._elem_in;
            this._elem_out.reverse();
            this._elem_in = [];
        }
        return this._elem_out.pop();
    }
}
window['Deque'] = Deque;
