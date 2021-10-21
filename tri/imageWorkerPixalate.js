self.addEventListener("message", e => {
    const d = 5;
    let w = h = Math.floor(900 / d);
    let nw = 900 * 4;

    let j = 0;
    for (j; j < h; j++) {
        let i = 0;
        for (i; i < w; i++) {
            let minx = i * d,
                miny = j * d,
                maxx = minx + d - 1,
                maxy = miny + d - 1;

            let nr = ng = nb = 0;
            let c = 0
            for (let l = miny; l <= maxy; l++){
                for (let k = minx; k <= maxx; k++) {
                    let r = l * nw + k * 4, g = r + 1, b = r + 2, a = r + 3;
                    nr += e.data[r];
                    ng += e.data[g];
                    nb += e.data[b];
                    c++;
                }
            }
            nr /= c; ng /= c; nb /=c;
            for (let l = miny; l <= maxy; l++){
                for (let k = minx; k <= maxx; k++) {
                    let r = l * nw + k * 4, g = r + 1, b = r + 2, a = r + 3;
                    e.data[r] = nr;
                    e.data[g] = ng;
                    e.data[b] = nb;
                }
            }
        }
    }
    self.postMessage(e.data, [e.data.buffer]);
});
