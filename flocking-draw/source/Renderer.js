class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        //this.context = this.canvas.getContext("2d");
    }

    init() {
        this.viewPort = new Vec2(this.canvas.width, this.canvas.height);
        this.PI2 = 2 * Math.PI;
        this.PIs = Math.PI / 4;
        this.PIe = Math.PI / 2;
        //this.context.fillStyle = 'rgba(150, 150, 150, 1)';
        //this.context.fillRect(0, 0, ...this.viewPort.vec);
        //this.context.lineWidth = 1;
        //this.context.lineCap = "round";
        //this.context.strokeStyle = 'rgba(150, 150, 150, 1)';
    }

    get getViewPort() {
        return this.viewPort;
    }

    clear() {
        this.context.fillStyle = 'rgba(230, 230, 230, 1)';
        this.context.fillRect(0, 0, ...this.viewPort.vec);
        this.context.fillStyle = 'rgba(200, 200, 200, 0.5)';
    }

    boid(boid) {
        const dir = Vec2.normalise(boid.vel).mult(boid.size);
        const p1 = Vec2.add(boid.pos, dir);
        const start = Math.PI - Math.atan2(...dir.vec) + this.PIs;

        this.context.beginPath();
        this.context.moveTo(...p1.vec);
        this.context.arc(...boid.pos.vec, boid.size, start, start + this.PIe);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    }

    boidLine(boid, seg) {
        //const dir = Vec2.normalise(boid.vel).mult(boid.size);
        //const p1 = boid.pos;
        //const p2 = Vec2.add(boid.pos, boid.vel);
        //this.context.strokeStyle = boid.col;
        this.context.beginPath();
        this.context.moveTo(...boid.pos.vec);

        //let j = seg - 1;
        //for (j; j >= 0; j--) {
            this.context.lineTo(...boid.tail[0].vec);
        //}
        this.context.stroke();
    }

    boidPoint(boid) {
        this.context.beginPath();
        this.context.arc(...boid.pos.vec, 5, 0, this.PI2);
        this.context.fill();
        this.context.stroke();
    }

    boidCircle(boid) {
        this.context.beginPath();
        this.context.arc(...boid.pos.vec, boid.size, 0, this.PI2);
        this.context.stroke();
    }

    boidTriangle(boid) {
        const dir = Vec2.normalise(boid.vel).mult(boid.size * 1.8);
        const p1 = Vec2.add(boid.pos, dir);
        dir.mult(0.3);
        const p2 = Vec2.add(boid.pos, new Vec2(dir.y, -dir.x));
        const p3 = Vec2.add(boid.pos, new Vec2(-dir.y, dir.x));
        dir.mult(-1.5);

        this.context.translate(...dir.vec);

        this.context.beginPath();
        this.context.moveTo(...p1.vec);
        this.context.lineTo(...p2.vec);
        this.context.lineTo(...p3.vec);

        this.context.fill();
        this.context.closePath();
        this.context.stroke();

        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    boidArrow(boid) {
        const dir = Vec2.normalise(boid.vel).mult(boid.size * 1.8);
        const p1 = Vec2.add(boid.pos, dir);
        dir.mult(0.3);
        const p2 = Vec2.add(boid.pos, new Vec2(dir.y, -dir.x));
        const p3 = Vec2.add(boid.pos, new Vec2(-dir.y, dir.x));
        const p4 = Vec2.add(boid.pos, dir);
        dir.mult(-1.5);

        this.context.translate(...dir.vec);

        this.context.beginPath();
        this.context.moveTo(...p1.vec);
        this.context.lineTo(...p2.vec);
        this.context.lineTo(...p4.vec);
        this.context.lineTo(...p3.vec);

        this.context.fill();
        this.context.closePath();
        this.context.stroke();

        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    boidSegments(boid, seg) {
        this.context.beginPath();
        this.context.arc(...boid.pos.vec, boid.size, 0, this.PI2);
        this.context.stroke();

        let j = seg - 3;
        let k = 1.2;
        for (j; j >= 0; j = j - 3) {
            this.context.beginPath();
            this.context.arc(...boid.tail[j].vec, boid.size / k, 0, this.PI2);
            this.context.stroke();
            k += 0.2;
        }

        this.context.beginPath();
        this.context.moveTo(...boid.pos.vec);

        let i = seg - 1;
        for (i; i >= 0; i--) {
            this.context.lineTo(...boid.tail[i].vec);
        }
        this.context.stroke();
    }

    line(p1, p2) {
        this.context.beginPath();
        this.context.moveTo(...p1.vec);
        this.context.lineTo(...p2.vec);
        this.context.stroke();
    }
}
