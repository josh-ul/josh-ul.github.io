document.addEventListener("DOMContentLoaded", main);

function main() {
    const input = (document.getElementsByTagName("input"))[0];
    const canvas = (document.getElementsByTagName("canvas"))[0];
    const context = canvas.getContext("2d");
    const worker = new Worker("worker.js");
    const worker2 = new Worker("worker.js");
    const worker3 = new Worker("worker.js");
    const worker4 = new Worker("worker.js");
    const imageWorker = new Worker("imageWorker.js");
    const size = 900;

    canvas.width = canvas.height = size;
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.strokeStyle = "rgba(0, 0, 0, 1)";
    context.lineWidth = 2;
    context.linekeCap = "but"; //round
    context.lineJoin = "round";  //miter

    let start = Date.now();

    input.addEventListener("keyup", e => {
        start = Date.now();
        let val = Number(e.target.value);
        val = val > 10 ? 10 : val;
        context.fillRect(0, 0, canvas.width, canvas.height);
        //worker.postMessage([[[size * .5, 0], [size, size], [0, size]], val]);
        worker.postMessage([[[2, 2], [size-2, 2], [size-2, size-2]], val]);
        worker2.postMessage([[[2, 2], [size-2, size-2], [2, size-2]], val]);

        worker3.postMessage([[[size-2, 2], [size-2, size-2], [2, size-2]], val]);
        worker4.postMessage([[[2, size-2], [2, 2], [size-2, 2]], val]);
    });

    const sendImageWorkerDelay = delay(4, sendImageWorker);

    worker.addEventListener("message", e => {
        draw(e, context, true);
        sendImageWorkerDelay(context, imageWorker);
    });

    worker2.addEventListener("message", e => {
        draw(e, context, true);
        sendImageWorkerDelay(context, imageWorker);
    });

    worker3.addEventListener("message", e => {
        draw(e, context, false);
        sendImageWorkerDelay(context, imageWorker);
    });

    worker4.addEventListener("message", e => {
        draw(e, context, false);
        sendImageWorkerDelay(context, imageWorker);
    });

    imageWorker.addEventListener("message", e => {
        let a = context.createImageData(size, size);
        a.data.set(e.data);
        context.putImageData(a, 0, 0);
        console.log(Date.now() - start);
    });

    input.value = 0;
    input.dispatchEvent(new Event("keyup"));
}

function sendImageWorker(context, imageWorker) {
    let a = (context.getImageData(0, 0, 900, 900)).data;
    imageWorker.postMessage(a, [a.buffer]);
}

function delay(wait, func) {
    let val = 0;
    return (...args) => {
        val++;
        if (val === wait) {
            func(...args);
            val = 0;
        }
    }
}

function draw(e, context, fill) {
    let tris = e.data;
    if (!fill) tris.reverse();
    for (let tri of tris) {
        context.strokeStyle = random();
        context.fillStyle = random();
        context.beginPath();
        context.moveTo(...tri[0]);
        context.lineTo(...tri[1]);
        context.lineTo(...tri[2]);
        context.closePath();
        if (fill) context.fill();
        else context.stroke();
    }
}

function random() {
    return "rgba(" + randInt(0,255) + "," + randInt(0,255) + "," + randInt(0,255) + ",1)";
}
function randInt(min, max) {
    if(max) return Math.round(Math.random() * (max - min) + min);
    else return Math.round(Math.random() * min);
}
