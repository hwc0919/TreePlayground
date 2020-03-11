import { BST } from "./BST";
import { RBColor, TreeUtil, BinNode } from "./BinNode"

let statureB: (BinNode) => number = TreeUtil.statureB;

export class RedBlack<T> extends BST<T> {
    protected solveDoubleRed(x: BinNode<T>): void {
        if (TreeUtil.isRoot(x)) {
            x.color = RBColor.Black;
            this.updateHeight(x);
            return;
        }
        if (TreeUtil.isBlack(x) || TreeUtil.isBlack(x.parent)) return;
        let p: BinNode<T> = x.parent;
        let g: BinNode<T> = p.parent;
        let u: BinNode<T> = TreeUtil.isLC(p) ? g.rc : g.lc;

        if (TreeUtil.isBlack(u)) {  // RR-1: u(Black)
            // dyeing gpx(rotated) with RBR
            if (TreeUtil.isLC(p) == TreeUtil.isLC(x)) p.color = RBColor.Black;
            else x.color = RBColor.Black;
            g.color = RBColor.Red;
            this.rotateAt(x);
        } else {  // RR-2: u(Red)
            // dying ugp with BRB
            g.color = RBColor.Red;
            p.color = u.color = RBColor.Black;
            this.updateHeight(p);
            this.updateHeight(u);
            this.solveDoubleRed(g);
        }
    }

    protected solveDoubleBlack(x: BinNode<T>): void {
        let p: BinNode<T> = x ? x.parent : this._hot;
        if (!p) return;
        let s: BinNode<T> = (x == p.rc) ? p.lc : p.rc;

        if (TreeUtil.isBlack(s)) {
            let t: BinNode<T>;
            // BB-1: s(Black), s->child(Red), B-underflow
            if (s.lc && TreeUtil.isRed(t = s.lc) || s.rc && TreeUtil.isRed(t = s.rc)) {
                // dyeing pst(rotated) with BOB
                let oldColor: RBColor = p.color;
                t.color = s.color = p.color = RBColor.Black;
                if (TreeUtil.isLC(s) == TreeUtil.isLC(t)) s.color = oldColor;
                else t.color = oldColor;
                this.rotateAt(t);
            } else { // BB-2: s(B), s->child(B)
                s.color = RBColor.Red;
                this.updateHeight(s);
                if (TreeUtil.isRed(p)) {  // BB-2R: s(B), s->child(B), p(Red)
                    // merge spx by dyeing sp(BR) with RB
                    p.color = RBColor.Black;
                    this.updateHeight(p);
                } else {  // BB-2B: s, s->child, p all Black
                    // merge spx, by dying sp(BB) with RB, statureB(p)--
                    this.updateHeight(p);
                    this.solveDoubleBlack(p);
                }
            }
        } else { // BB-3: s(Red), s-child and p must be Black
            let t: BinNode<T> = TreeUtil.isLC(s) ? s.lc : s.rc;
            s.color = RBColor.Black;
            p.color = RBColor.Red;
            this._hot = p;
            this.rotateAt(t);
            this.solveDoubleBlack(x);
        }
    }

    protected updateHeight(x: BinNode<T>): void {
        x.blackH = statureB(x.lc) > statureB(x.rc) ? statureB(x.lc) : statureB(x.rc);
        if (TreeUtil.isBlack(x)) x.blackH++;
    }

    public insert(e: T): BinNode<T> {
        let x: BinNode<T> = this.search(e);
        if (x) return x;

        x = new BinNode<T>(e, this._hot);
        if (!this._root) this._root = x;
        else e < this._hot.data ? this._hot.lc = x : this._hot.rc = x;

        this._size++;
        let oldX: BinNode<T> = x;
        this.solveDoubleRed(x);
        return oldX;
    }

    public remove(e: T): boolean {
        let x: BinNode<T> = this.search(e);
        if (!x) return false;

        x = this.removeAt(x); //  x becomes the successor
        if (--this._size == 0) return true; // empty tree

        if (!this._hot) {   // x is root
            this._root.color = RBColor.Black;
            this.updateHeight(this._root);
            return true;
        }
        if (TreeUtil.isBlackUpdated(this._hot)) // Original x is red
            return true;
        if (TreeUtil.isRed(x)) {    // successor is red
            x.color = RBColor.Black;
            this.updateHeight(x);
            return true;
        }

        this.solveDoubleBlack(x);
        return true;
    }
}

window['RedBlack'] = RedBlack;