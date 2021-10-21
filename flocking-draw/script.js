document.addEventListener("DOMContentLoaded", main);

function main() {
    const canvas = document.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    Flock.prototype.mouse = new Vec2(canvas.width * 0.5, canvas.height * 0.5);
    canvas.addEventListener("mousemove", e => {
        Flock.prototype.mouse = new Vec2(e.clientX, e.clientY);
    });

    Flock.prototype.chase = true;
    canvas.addEventListener("mousedown", e => {
        Flock.prototype.chase = false;
    });

    canvas.addEventListener("mouseup", e => {
        Flock.prototype.chase = true;
    });

    const gl = new WebGL(canvas);
    const flock = new Flock(gl);
    flock.init();
    flock.run();
}
