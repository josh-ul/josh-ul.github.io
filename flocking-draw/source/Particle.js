class Particle {
    constructor(pos, vel, col, rad) {
        this.pos = pos;
        this.vel = vel;
        this.col = col;
        this.rad = rad;
    }

    update(viewport, particles, i) {
        //this.collisionDetect(particles, i);
        //this.collisionBounce(particles, i);
        this.bounds(viewport);
        //this.wrap(viewport);

        //let d = Vec2.sub(this.__proto__.mouse, this.pos);
        // let s = d.size();
        // if (s < Util.randInt(20, 50)) {
        //     d = d.scale(-1);
        // }
        //d.limit(0.1);
        let d = new Vec2(0, 0.1);
        this.vel = this.vel.add(d);

        let s = this.seperation(particles, i);
        s.limit(0.5);
        this.vel = this.vel.add(s);

        this.vel.limit(5);

        this.pos = this.pos.add(this.vel);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.col.rgba;
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI);
        ctx.fill();
    }

    bounds(viewport) {
        if ((this.pos.x + this.rad) >= viewport.x) {
            this.vel.x = -(this.vel.x) * 2;
        }

        else if ((this.pos.x - this.rad) <= 0) {
            this.vel.x = -(this.vel.x)  * 2;
        }

        if ((this.pos.y + this.rad) >= viewport.y) {
            this.vel.y = -(this.vel.y)  * 2;
        }

        else if ((this.pos.y - this.rad) <= 0) {
            this.vel.y = -(this.vel.y)  * 2;
        }
    }

    wrap(viewport) {
        if (this.pos.x >= viewport.x) {
            this.pos.x = 0;
        }

        else if (this.pos.x <= 0) {
            this.pos.x = viewport.x;
        }

        if (this.pos.y >= viewport.y) {
            this.pos.y = 0;
        }

        else if (this.pos.y <= 0) {
            this.pos.y = viewport.y;
        }
    }

    collisionDetect(particles, i) {
        for (let j = 0; j < particles.length; j++) {
            if (!(i === j)) {
                let d = Vec2.sub(this.pos, particles[j].pos);
                var distance = d.size();

                if (distance < this.rad + particles[j].rad) {
                    particles[j].col = this.color = Col4.random();
                }
            }
        }
    }

    seperation(particles, i) {
        let v = new Vec2(0,0);
        for (let j = 0; j < particles.length; j++) {
            if (!(i === j)) {
                let d = Vec2.sub(this.pos, particles[j].pos);
                var distance = d.size();

                if (distance < (this.rad + particles[j].rad) * 1.1) {
                    v = v.add(d);
                }
            }
        }
        return v;
    }

    collisionBounce(particles, i) {
        for (let j = 0; j < particles.length; j++) {
            if (!(i === j)) {
                let d = Vec2.sub(this.pos, particles[j].pos);
                var distance = d.size();

                if (distance < this.rad + particles[j].rad) {
                    // this.vel.x = newVel(this.vel.x, this.rad, particles[j].vel.x, particles[j].rad);
                    // this.vel.y = newVel(this.vel.y, this.rad, particles[j].vel.y, particles[j].rad);
                    //
                    // particles[j].vel.x = newVel(particles[j].vel.x, particles[j].rad, this.vel.x, this.rad);
                    // particles[j].vel.y = newVel(particles[j].vel.y, particles[j].rad, this.vel.y, this.rad);

                    // let temp = Vec2.scale(this.vel, (2 * this.rad / (particles[j].rad + this.rad)));
                    // this.vel = Vec2.scale(particles[j].vel, (2 * particles[j].rad / (this.rad + particles[j].rad)));
                    // particles[j].vel = temp;
                    //

                    let a = this, b = particles[j];

                    // let d = a.pos.sub(b.pos).size();
                    // let n = Vec2.sub(b.pos, a.pos);
                    // n.normalise();
                    //
                    // let p = 2 * (a.vel.x * n.x + a.vel.y * n.y - b.vel.x * n.x - b.vel.y * n.y) / (a.rad + b.rad)
                    //
                    // this.vel.x = a.vel.x - p * a.rad * n.x;
                    // this.vel.y = a.vel.y - p * a.rad * n.y
                    // particles[j].vel.x = b.vel.x + p * b.rad * n.x;
                    // particles[j].vel.y = b.vel.y + p * b.rad * n.y
                    //
                    // this.pos = this.pos.add(this.vel);
                    // particles[j].pos = particles[j].pos.add(particles[j].vel);


                    // let n = a.pos.sub(b.pos);
                    // let ns = n.normalise();
                    // let v = a.vel.sub(b.vel);
                    // let s = v.dot(n);
                    // let m = 2 * b.rad / (a.rad + b.rad);
                    // n.scale(m * s / ns)
                    // this.vel = this.vel.sub(n);
                    // this.pos = this.pos.add(this.vel);
                    //
                    // n = b.pos.sub(a.pos);
                    // ns = n.normalise();
                    // v = b.vel.sub(a.vel);
                    // s = v.dot(n);
                    // m = 2 * a.rad / (a.rad + b.rad);
                    // n.scale(m * s / ns);
                    // particles[j].vel = particles[j].vel.sub(n);
                    // particles[j].pos = particles[j].pos.add(particles[j].vel);

                    let n = b.pos.sub(a.pos);
                    n.normalise();
                    let p = (2 * (a.vel.dot(n) - b.vel.dot(n))) / (a.rad + b.rad);

                    this.vel = a.vel.sub(n.scale(p * b.rad));
                    particles[j].vel = b.vel.add(n.scale(p * a.rad));

                    //this.vel.scale(this.rad - distance);
                    //particles[j].vel.scale(particles[j].rad - distance);

                    //this.vel.limit((50 - this.rad) * 0.1);
                    //particles[j].vel.limit((50 - particles[j].rad) * 0.1);

                    this.pos = this.pos.add(this.vel);
                    particles[j].pos = particles[j].pos.add(particles[j].vel);
                }
            }
        }
    }
}
