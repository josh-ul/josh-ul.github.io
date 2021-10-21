function noiseGrid(a) {
    const t = new Uint8Array(a * a * 4);

    const l = 1;
    const h = 4;
    const s = h - l + 1;
    const o = {x: 0, y: 0};
    const m = {x: 1, y: 1};

    let i, j, k = l;
    for (k; k <= h; k++) {
        let f = a / k;
        j = 0
        m.x *= k;
        m.y *= k;
        for (j; j < a; j++) {
            i = 0;
            let jj = j * a * 4;
            for (i; i < a; i++) {
                let ii = jj + i * 4;
                t[ii] = t[ii + 1] = t[ii + 2] = t[ii + 3] =
                t[ii] + Math.floor(noise((o.x + i * m.x) / f, (o.y + j * m.y) / f) / s * 255);
            }
        }
    }
    return {
        image: t,
        width: a,
        height: a
    };
}

function random(x, y) {
    return Math.abs((Math.sin(dot(x, y, 12.9898, 78.233)) * 43758.5453123) % 1);
}
function dot(x0, y0, x1, y1) {
    return x0 * x1 + y0 * y1;
}
function mix(x, y, a) {
    return x * (1 - a) + y * a;
}

// 2D Noise based
function noise(s, t) {
    let is = Math.floor(s);
    let it = Math.floor(t);
    let fs = s % 1;
    let ft = t % 1;

    // Four corners in 2D of a tile
    let a = random(is, it);
    let b = random(is + 1, it);
    let c = random(is, it + 1);
    let d = random(is + 1, it + 1);

    // Smooth Interpolation
    // Cubic Hermine Curve
    us = fs * fs * (3 - 2 * fs);
    ut = ft * ft * (3 - 2 * ft);

    // Quintic interpolation curve
    // us = fs * fs * fs * (fs * (fs * 6 - 15) + 10);
    // ut = ft * ft * ft * (ft * (ft * 6 - 15) + 10);

    // Mix 4 coorners percentages
    return mix(a, b, us) + (c - a) * ut * (1.0 - us) + (d - b) * us * ut;
}
