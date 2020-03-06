export class Deque<T> {
    _elem_out: Array<T>;
    _elem_in: Array<T>;

    constructor(e: Array<T> = null) {
        if (!e || e.length === 0)
            this._elem_in = [];
        else
            this._elem_in = e;
        this._elem_out = [];
    }
    public size(): number { return this._elem_in.length + this._elem_out.length; }
    public empty(): boolean { return this.size() === 0; }
    public push(e: T): void {
        this._elem_in.push(e);
    }
    public unshift(e: T): void {
        this._elem_out.push(e);
    }
    public pop(): T {
        if (this._elem_in.length === 0) {
            this._elem_in = this._elem_out;
            this._elem_in.reverse();
            this._elem_out = [];
        }
        return this._elem_in.pop();
    }
    public shift(): T {
        if (this._elem_out.length === 0) {
            this._elem_out = this._elem_in;
            this._elem_out.reverse();
            this._elem_in = [];
        }
        return this._elem_out.pop();
    }
};

window['Deque'] = Deque;