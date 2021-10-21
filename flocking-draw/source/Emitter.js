class Emitter {
    constructor(count) {
        this.count = count;
        this.particles = [];
    }

    init(viewport) {
        let i = 0;
        for (i; i < this.count; i++) {
          var size = Util.randInt(4, 16);
          var particle = new Particle(
              new Vec2(Util.randInt(0 + size, viewport.x - size), Util.randInt(0 + size, viewport.y - size)),
              Vec2.random(-2, 2),
              Col4.random(),
              size
          );
          particle.vel = Vec2.random(-2, 4);
          this.particles.push(particle);
        }

        // let p = this.particles[0];
        // p.rad = 50;
        // p.col = new Col4(255, 255, 255, 1);
        //
        // window.addEventListener("mousemove", e => {
        //     let m = new Vec2(e.clientX, e.clientY);
        //     let d = m.sub(p.pos);
        //     d.limit(2);
        //     p.vel = d;
        // });
    }

    addParticle(viewport, pos) {
        var size = Util.randInt(4, 16);
        var particle = new Particle(
            pos,
            Vec2.random(-2, 2),
            Col4.random(),
            size
        );
        particle.vel = Vec2.random(-2, 4);
        particle.vel.y = -Math.abs(particle.vel.y);
        this.particles.push(particle);
        this.count++;

        if (this.count > 200) {
            this.particles.shift();
            this.count--;
        }
    }

    update(viewport, ctx) {
        for (var i = 0; i < this.count; i++) {
            this.particles[i].update(viewport, this.particles, i);
            this.particles[i].draw(ctx);
        }
    }
}
