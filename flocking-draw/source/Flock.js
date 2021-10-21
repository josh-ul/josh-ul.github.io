class Flock {
    constructor(renderer, count) {
        this.rndr = renderer;
        this.boids = [];
        this.opts = {
            count: count || 1000,
            size: 10,
            maxVel: 5,
            maxAcc: 1,
            ali: {
                rng: 40,
                scl: 2
            },
            coh: {
                rng: 80,
                scl: 1
            },
            sep: {
                rng: 20,
                scl: 4
            },
            bnd: {
                rng: 50,
                scl: 1
            }
        };
    }

    init() {
        this.opts.ali.rngSqr = this.opts.ali.rng ** 2;
        this.opts.coh.rngSqr = this.opts.coh.rng ** 2;
        this.opts.sep.rngSqr = this.opts.sep.rng ** 2;

        this.opts.bounds = this.rndr.viewPort;
        this.opts.wrap = new Vec2(this.opts.bounds.x + this.opts.size, this.opts.bounds.y + this.opts.size);
        this.opts.contain = new Vec2(this.opts.bounds.x - this.opts.bnd.rng, this.opts.bounds.y - this.opts.bnd.rng);

        this.posArray = new Float32Array(this.opts.count * 2);
        this.velArray = new Float32Array(this.opts.count * 2);

        let i = 0;
        for (i; i < this.opts.count; i++) {
            this.addBoid(
                new Vec2(Util.randInt(this.opts.bnd.rng, this.opts.contain.x), Util.randInt(this.opts.bnd.rng, this.opts.contain.y)),
                new Vec2(Util.randFloat(-1, 1), Util.randFloat(-1, 1)),
                this.opts.size,
                Col4.random().rgba
            );
            this.posArray[i * 2] = this.boids[i].pos.vec[0];
            this.posArray[i * 2 + 1] = this.boids[i].pos.vec[1];
            this.velArray[i * 2] = this.boids[i].vel.vec[0];
            this.velArray[i * 2 + 1] = this.boids[i].vel.vec[1];
        }
        this.rndr.init(this.opts.count, this.posArray, this.velArray);
    }

    run() {
        this.rndr.draw(this.posArray, this.velArray);
        this.update();
        requestAnimationFrame(() => {
            this.run();
        });
    }

    update() {
        let i = 0;
        for (i; i < this.opts.count; i++) {
            this.boids[i].pos.add(this.boids[i].vel);

            this.posArray[i * 2] = this.boids[i].pos.vec[0];
            this.posArray[i * 2 + 1] = this.boids[i].pos.vec[1];
            this.velArray[i * 2] = this.boids[i].vel.vec[0];
            this.velArray[i * 2 + 1] = this.boids[i].vel.vec[1];

            this.wrap(this.boids[i]);

            this.boids[i].acc.add(this.contain(this.boids[i]));
            this.boids[i].acc.add(this.seek(this.boids[i]));
            this.boids[i].acc.add(this.oneForAll(this.boids[i]));

            this.boids[i].acc.limit(this.opts.maxAcc);
            this.boids[i].vel.add(this.boids[i].acc);
            this.boids[i].vel.limit(this.opts.maxVel);
            this.boids[i].acc.zero();
        }
    }

    wrap(boid) {
        let wrap = false;
        if (boid.pos.x >= this.opts.wrap.x) {
            boid.pos.x = -boid.size;
            wrap = true;
        }
        else if (boid.pos.x <= -boid.size) {
            boid.pos.x = this.opts.wrap.x;
            wrap = true;
        }
        if (boid.pos.y >= this.opts.wrap.y) {
            boid.pos.y = -boid.size;
            wrap = true;
        }
        else if (boid.pos.y <= -boid.size) {
            boid.pos.y = this.opts.wrap.y;
            wrap = true;
        }
        if (wrap) {
            let j = 0;
            for (j; j < this.opts.tail; j++) {
                boid.tail[j] = boid.pos;
            }
        }
    }

    contain(boid) {
        let a = Vec2.zero();
        if (boid.pos.x >= this.opts.contain.x) {
            a.x = -1;
        }
        else if (boid.pos.x <= this.opts.bnd.rng) {
            a.x = 1;
        }
        if (boid.pos.y >= this.opts.contain.y) {
            a.y = -1;
        }
        else if (boid.pos.y <= this.opts.bnd.rng) {
            a.y = 1;
        }
        return a.normalise().mult(this.opts.bnd.scl);
    }

    seek(boid) {
        if (this.__proto__.chase) {
            let a = Vec2.sub(this.__proto__.mouse, boid.pos).normalise().mult(2);
            return Vec2.add(boid.vel, a).normalise().mult(1);
        }
        else {
            let dist = boid.pos.distSqr(this.__proto__.mouse);
            if (dist <= 30000) {
                let a = Vec2.sub(this.__proto__.mouse, boid.pos).normalise().mult(10);
                return Vec2.sub(boid.vel, a).normalise().mult(10);
            }
            else {
                let a = Vec2.sub(this.__proto__.mouse, boid.pos).normalise().mult(2);
                return Vec2.add(boid.vel, a).normalise().mult(1);
            }
        }
    }

    oneForAll(boid) {
        let i = 0, dist, combined = Vec2.zero();
        let ac = 0, cc = 0, sc = 0;
        let ali = Vec2.zero(), coh = Vec2.zero(), sep = Vec2.zero();

        for (i; i < this.opts.count; i++) {
            if (boid != this.boids[i]) {
                dist = boid.pos.distSqr(this.boids[i].pos);
                if (dist <= this.opts.ali.rngSqr) {
                    ali.add(this.boids[i].vel);
                    ac++;
                }
                if (dist <= this.opts.coh.rngSqr) {
                    coh.add(this.boids[i].pos);
                    cc++;
                }
                if (dist <= this.opts.sep.rngSqr) {
                    sep.add(Vec2.sub(this.boids[i].pos, boid.pos).normalise().div(dist));
                    sc++;
                }
            }
        }
        if (ac > 0) {
            combined.add(ali.div(ac).normalise().mult(this.opts.ali.scl));
        }
        if (cc > 0) {
            combined.add(coh.div(cc).sub(boid.pos).normalise().mult(this.opts.coh.scl));
        }
        if (sc > 0) {
            combined.add(sep.div(sc).normalise().mult(-this.opts.sep.scl));
        }
        return combined;
    }

    addBoid(pos, vel, size, col) {
        this.boids.push({
            pos: pos,
            vel: vel,
            acc: Vec2.zero(),
            size: size,
            col: col
        });
    }

    removeBoid(index) {
        if (index > 1 && index < this.boids.count) {
            this.boids.splice(index, 1);
        }
        else {
            this.boids.shift();
        }
    }
}
