class Flock {
    constructor(canvas, count) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.viewPort = new Vec2(this.canvas.width, this.canvas.height);

        this.count = count || 100;
        this.boids = [];
        this.hashTable = [];

        // Flocking options
        this.a = 50;
        this.c = 50;
        this.s = 50;
        this.range = 80;
        this.rangeSqr = this.range ** 2;
    }

    init() {
        let i = 0, size = 40;

        for(i; i < this.count; i++) {
            this.addBoid(
                new Vec2(Util.randInt(0 + size, this.viewPort.x - size), Util.randInt(0 + size, this.viewPort.y - size)),
                Vec2.random(-2, 2),
                size
            );
        }
        //this.initHashTable();
    }

    run() {
        this.draw();
        this.update();

        requestAnimationFrame(() => {
            this.run();
        });
    }

    draw() {
        this.context.fillStyle = 'rgba(230, 230, 230, 1)';
        this.context.fillRect(0, 0, ...this.viewPort.vec);
        this.context.fillStyle = 'rgba(200, 200, 200, 0.5)';

        let i = 0, dir, back, p1, p2, p3, p4;

        for(i; i < this.count; i++) {
            dir = Vec2.normalise(this.boids[i].vel);
            dir.scale(this.boids[i].size * 0.9);
            p1 = Vec2.add(this.boids[i].pos, dir);

            dir.scale(0.3);
            p2 = Vec2.add(this.boids[i].pos, new Vec2(dir.y, -dir.x));
            p3 = Vec2.add(this.boids[i].pos, new Vec2(-dir.y, dir.x));
            p4 = Vec2.add(this.boids[i].pos, dir);

            //dir.scale(0.4);
            //back = Vec2.sub(this.boids[i].pos, dir);
            //dir.scale(0.5);
            // p2 = Vec2.add(back, new Vec2(dir.y, -dir.x));
            // p3 = Vec2.add(back, new Vec2(-dir.y, dir.x));
            dir.scale(-1.5);
            this.context.translate(...dir.vec);
            this.context.beginPath();
            this.context.moveTo(...p1.vec);
            this.context.lineTo(...p2.vec);
            this.context.lineTo(...p4.vec);
            this.context.lineTo(...p3.vec);

            this.context.fill();
            this.context.closePath();
            this.context.strokeStyle = 'rgba(150, 150, 150, 1)';
            this.context.stroke();
            this.context.setTransform(1, 0, 0, 1, 0, 0);

            // this.context.beginPath();
            // this.context.arc(...this.boids[i].pos.vec, this.boids[i].size * 0.5, 0, 2 * Math.PI);
            // this.context.stroke();
            //
            // let h = new Vec2(...this.boids[i].vel.vec);
            // h.scale(10);
            // let f = Vec2.add(this.boids[i].pos, h);
            //
            // this.context.beginPath();
            //
            // this.context.moveTo(...this.boids[i].pos.vec);
            // this.context.lineTo(...f.vec);
            // this.context.stroke();

            // this.context.beginPath();
            // this.context.arc(...this.boids[i].pos.vec, this.range, 0, 2 * Math.PI);
            // this.context.stroke();

            // let p = this.boids[i].ali;
            // p.scale(20);
            // p = Vec2.add(this.boids[i].pos, p);
            //
            // this.context.strokeStyle = 'rgba(255, 0, 0, 1)';
            // this.context.beginPath();
            // this.context.moveTo(...this.boids[i].pos.vec);
            // this.context.lineTo(...p.vec);
            // this.context.stroke();
            //
            // p = this.boids[i].coh;
            // p.scale(20);
            // p = Vec2.add(this.boids[i].pos, p);
            //
            // this.context.strokeStyle = 'rgba(0, 255, 0, 1)';
            // this.context.beginPath();
            // this.context.moveTo(...this.boids[i].pos.vec);
            // this.context.lineTo(...p.vec);
            // this.context.stroke();
            //
            // p = this.boids[i].sep;
            // p.scale(20);
            // p = Vec2.add(this.boids[i].pos, p);
            //
            // this.context.strokeStyle = 'rgba(0, 0, 255, 1)';
            // this.context.beginPath();
            // this.context.moveTo(...this.boids[i].pos.vec);
            // this.context.lineTo(...p.vec);
            // this.context.stroke();
        }
    }

    update() {
        let i = 0;
        let dir, back, p1, p2, p3;
        let ali, coh, sep;

        for(i; i < this.count; i++) {
            this.boids[i].pos.add(this.boids[i].vel);

            this.wrap(this.boids[i]);
            this.boids[i].vel.add(this.contain(this.boids[i]));

            // ali = this.alignment(this.boids[i]);
            // coh = this.cohesion(this.boids[i]);
            // sep = this.seperation(this.boids[i]);
            //
            // this.boids[i].vel.add(ali);
            // this.boids[i].vel.add(coh);
            // this.boids[i].vel.add(sep);
            //this.boids[i].vel.normalise();

            this.boids[i].vel.add(this.oneForAll(this.boids[i]));

            this.boids[i].vel.limit(4);
            //this.boids[i].vel.normalise();
        }
    }

    wrap(boid) {
        const xMax = this.viewPort.x + boid.size;
        const yMax = this.viewPort.y + boid.size;

        if (boid.pos.x >= xMax) {
            boid.pos.x = -boid.size;
        }
        else if (boid.pos.x <= -boid.size) {
            boid.pos.x = xMax;
        }
        if (boid.pos.y >= yMax) {
            boid.pos.y = -boid.size;
        }
        else if (boid.pos.y <= -boid.size) {
            boid.pos.y = yMax;
        }
    }

    contain(boid) {
        const xMax = this.viewPort.x - this.range;
        const yMax = this.viewPort.y - this.range;

        let a = new Vec2(0, 0);

        if (boid.pos.x >= xMax) {
            a.x = -1;
        }
        else if (boid.pos.x <= this.range) {
            a.x = 1;
        }
        if (boid.pos.y >= yMax) {
            a.y = -1;
        }
        else if (boid.pos.y <= this.range) {
            a.y = 1;
        }
        a.limit(0.2);
        return a;
    }

    alignment(boid) {
        let i = 0, ali = new Vec2(0, 0), count = 0;
        const a2 = this.a ** 2;

        for(i; i < this.count; i++) {
            if (boid != this.boids[i]) {
                if (boid.pos.distSqr(this.boids[i].pos) <= a2) {
                    ali.add(this.boids[i].vel);
                    count++;
                }
            }
        }
        if (count === 0) {
            return ali;
        }
        else {
            ali.div(count);
            ali.limit(1);
            return ali;
        }
    }

    cohesion(boid) {
        let i = 0, coh = new Vec2(0, 0), count = 0;
        const c2 = this.c ** 2;

        for(i; i < this.count; i++) {
            if (boid != this.boids[i]) {
                if (boid.pos.distSqr(this.boids[i].pos) <= c2) {
                    coh.add(this.boids[i].pos);
                    count++;
                }
            }
        }
        if (count === 0) {
            return coh;
        }
        else {
            coh.div(count);
            coh.sub(boid.pos);
            coh.limit(1);
            return coh;
        }
    }

    seperation(boid) {
        let i = 0, sep = new Vec2(0, 0), count = 0;
        const s2 = this.s ** 2;

        for(i; i < this.count; i++) {
            if (boid != this.boids[i]) {
                if (boid.pos.distSqr(this.boids[i].pos) <= s2) {
                    sep.add(Vec2.sub(this.boids[i].pos, boid.pos));
                    count++;
                }
            }
        }
        if (count === 0) {
            return sep;
        }
        else {
            sep.div(count);
            sep.scale(-1);
            sep.limit(1);
            return sep;
        }
    }

    oneForAll(boid) {
        let i = 0, count = 0, all = new Vec2(0, 0), dist, sizeSqr = boid.size ** 2;
        boid.ali = new Vec2(0, 0);
        boid.coh = new Vec2(0, 0);
        boid.sep = new Vec2(0, 0);

        for(i; i < this.count; i++) {
            if (boid != this.boids[i]) {
                dist = boid.pos.distSqr(this.boids[i].pos);
                if (dist > 0 && dist <= this.rangeSqr) {
                    boid.ali.add(this.boids[i].vel);
                    boid.coh.add(this.boids[i].pos);
                    boid.sep.add(Vec2.sub(this.boids[i].pos, boid.pos).normalise().div(dist));
                    count++;
                    // if (dist <= sizeSqr) {
                    //     let k = Vec2.sub(boid.pos, this.boids[i].pos);
                    //     k.normalise();
                    //     boid.vel.add(k);
                    // }
                    // this.context.strokeStyle = 'rgba(255, 0, 0, 1)';
                    // this.context.beginPath();
                    // this.context.moveTo(...this.boids[i].pos.vec);
                    // this.context.lineTo(...boid.pos.vec);
                    // this.context.stroke();
                }
                // else {
                //     this.context.strokeStyle = 'rgba(0, 255, 0, 1)';
                //     this.context.beginPath();
                //     this.context.moveTo(...this.boids[i].pos.vec);
                //     this.context.lineTo(...boid.pos.vec);
                //     this.context.stroke();
                // }
            }
        }
        if (count === 0) {
            return all;
        }
        else {
            boid.ali.div(count);
            //boid.ali.limit(1);
            boid.ali.normalise();

            boid.coh.div(count);
            boid.coh.sub(boid.pos);
            //boid.coh.limit(1);
            boid.coh.normalise();

            boid.sep.div(count);
            boid.sep.scale(-1);
            boid.sep.normalise();
            boid.sep.scale(1.1);

            all.add(boid.ali);
            all.add(boid.coh);
            all.add(boid.sep);
            //all.limit(2);
            return all;
        }
    }

    addBoid(pos, vel, size) {
        this.boids.push({pos: pos, vel: vel, size: size, ali: new Vec2(0, 0), coh: new Vec2(0, 0), sep: new Vec2(0, 0)});
    }

    removeBoid(index) {
        if (index) {
            this.boids.splice(index, 1);
        }
        else {
            this.boids.shift();
        }
    }

    initHashTable() {
        let bs = this.range * 2;
        let bx = Math.floor(this.viewPort.x / bs) + 1;
        let by = Math.floor(this.viewPort.y / bs) + 1;

        let i = 0, j = 0;

        for (j; j < by; j++) {
            i = 0;
            let temp = [];
            for (i; i < bx; i++) {
                temp[i] = [];

                this.context.rect(i * bs, j * bs, i * bs + bs, j * bs + bs);
                this.context.strokeStyle = 'rgba(150, 150, 150, 1)';
                this.context.stroke();

            }
            this.hashTable[j] = temp;
        }
        i = 0;
        for(i; i < this.count; i++) {
            let xx = Math.floor(this.boids[i].pos.x / bs);
            let yy = Math.floor(this.boids[i].pos.y / bs);
            this.hashTable[yy][xx].push(i);

            this.boids[i].hashKey = [xx, yy];

            let hqx = (this.boids[i].pos.x % bs) < this.range ? -1 : 1;
            let hqy = (this.boids[i].pos.y % bs) < this.range ? -1 : 1;
            this.boids[i].hashQuad = [hqx, hqy];
            console.log(this.boids[i].hashQuad);
        }
        console.log(this.hashTable);
        i = 0;
        for(i; i < this.count; i++) {
            let b1 = [], b2 = [], b3 = [], b4 = [];
            let xxx = this.boids[i].hashKey[0] + this.boids[i].hashQuad[0];
            let yyy = this.boids[i].hashKey[1] + this.boids[i].hashQuad[1];

            b1 = this.hashTable[this.boids[i].hashKey[1]][this.boids[i].hashKey[0]];

            if (xxx >= 0 && xxx < bx) {
                b3 = this.hashTable[this.boids[i].hashKey[1]][xxx];
            }
            if (yyy >= 0 && yyy < by) {
                b2 = this.hashTable[yyy][this.boids[i].hashKey[0]];
            }
            if ((xxx >= 0 && xxx < bx) && (yyy >= 0 && yyy < by)) {
                b4 = this.hashTable[yyy][xxx];
            }

            this.boids[i].near = [...b1, ...b2, ...b3, ...b4];
            console.log(i, this.boids[i].near);
        }
    }
}
