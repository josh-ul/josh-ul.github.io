self.addEventListener("message", e => {
    let w = h = 900;
    let nw = w * 4;

    let j = 0;
    for (j; j < h; j++) {
        let i = 0;
        for (i; i < w; i++) {
            let r = j * nw + i * 4, g = r + 1, b = r + 2, a = r + 3;
            let av = 255-(e.data[r] + e.data[g] + e.data[b]) / 3;
            e.data[r] = av;
            e.data[g] = av;
            e.data[b] = av;
        }
    }
    self.postMessage(e.data, [e.data.buffer]);
});
