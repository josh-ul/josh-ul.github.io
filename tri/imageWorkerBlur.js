self.addEventListener("message", e => {
    const w = h = 900, nw = w * 4, d = 2;
    let j = 0;
    for (j; j < h; j++) {
        let i = 0;
        for (i; i < w; i++) {
            let minx = i - d,
                miny = j - d,
                maxx = i + d,
                maxy = j + d;

            let nr = ng = nb = 0;
            let c = 0
            for (let l = miny; l <= maxy; l++){
                if (l >= 0 && l < h) {
                    for (let k = minx; k <= maxx; k++) {
                        if (k >= 0 && k < w) {
                            let r = l * nw + k * 4, g = r + 1, b = r + 2, a = r + 3;
                            nr += e.data[r];
                            ng += e.data[g];
                            nb += e.data[b];
                            c++;
                        }
                    }
                }
            }
            let r = j * nw + i * 4, g = r + 1, b = r + 2, a = r + 3;
            e.data[r] = nr / c;
            e.data[g] = ng / c;
            e.data[b] = nb / c;
        }
    }
    self.postMessage(e.data, [e.data.buffer]);
});

function near(x, y, d) {
    let minx = x - d,
        miny = y - d,
        maxx = x + d,
        maxy = y + d;

    for (let l = miny; l <= maxy; l++){
        for (let k = minx; k <= maxx; k++) {
            console.log(k, l);
        }
    }
}
