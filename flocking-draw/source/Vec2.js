class Vec2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    get vec() {
        return [this.x, this.y];
    }

    set vec(vec) {
        this.x = vec[0];
        this.y = vec[1];
    }

    zero() {
        this.x = this.y = 0;
        return this;
    }

    static zero() {
        return new Vec2(0, 0);
    }

    unit() {
        this.x = this.y = 1;
        return this;
    }

    static unit() {
        return new Vec2(1, 1);
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    static clone(vec) {
        return new Vec2(vec.x, vec.y);
    }

    copy(vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    static add(a, b) {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    static sub(a, b) {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    mult(a) {
        this.x *= a;
        this.y *= a;
        return this;
    }

    static mulit(vec, a) {
        return new Vec2(vec.x * a, vec.y * a);
    }

    div(a) {
        if (a === 0) return this;
        this.x /= a;
        this.y /= a;
        return this;
    }

    static div(vec, a) {
        if (a === 0) return vec;
        return new Vec2(vec.x / a, vec.y / a);
    }

    sizeSqr() {
        return this.x ** 2 + this.y ** 2;
    }

    size() {
        return Math.sqrt(this.sizeSqr());
    }

    distSqr(vec) {
        return Vec2.sub(this, vec).sizeSqr();
    }

    dist(vec) {
        return Vec2.sub(this, vec).size();
    }

    normalise() {
        return this.div(this.size() || 1);
    }

    static normalise(vec) {
        return Vec2.div(vec, vec.size() || 1);
    }

    limit(l) {
        if (this.size() > l) {
            this.normalise().mult(l);
        }
        return this;
    }

    static limit(vec, l) {
        if (vec.size() > l) {
            return Vec2.normalise(vec).mult(l);
        }
        return vec;
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
}


// copy funcitons?
