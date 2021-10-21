function voronoiPattern(width, height) {
    let a = width;
    const t = new Uint8Array(a * a * 4);

    const l = 1;
    const h = 2;
    const s = h - l + 1;
    const o = {x: 0, y: 0};
    const m = {x: 4, y: 8};

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

    let features = [];
    j = 0;
    for (j; j < a; j++) {
        i = 0;
        let jj = j * a * 4;
        for (i; i < a; i++) {
            let ii = jj + i * 4;
            let v = voronoiGrid(a, a, i, j, features);
            t[ii] *= v;
            t[ii + 1] *= v;
            t[ii + 2] *= v;
            t[ii + 3] *= v;
        }
    }

    return {
        image: t,
        width: a,
        height: a
    };
}

function voronoiNoise(width, height, s, t, features) {
    let d = width * height;
    let p = {};
    let i = 0;
    let n = features.length;

    for (i; i < n; i++) {
        if (s === features[i].x && t === features[i].y) {
            return 255;
        }

        let dist = distance(s, t, features[i].x, features[i].y);
        if (dist <= d) {
            d = dist;
            p = features[i];
        }
    }
    return d * 4 > 255 ? 0 : 255 - d * 4;
}

function voronoiBoundry(width, height, s, t, features) {
    let d = width * height;
    let p = {};
    let i = 0;
    let n = features.length;

    for (i; i < n; i++) {
        if (s === features[i].x && t === features[i].y) {
            return 255;
        }
        else {
            let dist = Math.floor(distance(s, t, features[i].x, features[i].y));
            if (dist === d || dist === d + 1 || dist === d - 1) {
                return 255;
            }
            if (dist < d) {
                d = dist;
                p = features[i];
            }
        }
    }
    return 0;
}

function voronoiGrid(width, height, s, t, features) {
    let numCellsX = 32;
    let numCellsY = 16;

    let cellWidth = width / numCellsX;
    let cellHeight = height / numCellsY;

    let maxDist = distance(0, 0, 1, 1);

    let scaledS = s / cellWidth;
    let scaledT = t / cellHeight;

    let cellX = Math.floor(scaledS);
    let cellY = Math.floor(scaledT);

    let fractX = scaledS % 1;
    let fractY = scaledT % 1;

    let dist = maxDist;

    let i, j = -1;
    for (j; j <= 1; j++) {
        i = -1;
        for (i; i <= 1; i++) {
            let featurePoint = random2(cellX + i, cellY + j);

            if ((cellY + j) % 2 === 0) {
                featurePoint.x = 0 + featurePoint.x * 0.2;
                featurePoint.y = 0.2 + featurePoint.y * 0.6;
            }
            else {
                featurePoint.x = 0.5 + featurePoint.x * 0.2;
                featurePoint.y = 0.2 + featurePoint.y * 0.6;
            }

            let nextDist = distance(fractX, fractY, featurePoint.x + i, featurePoint.y + j);
            if (nextDist <= dist) {
                dist = nextDist;
            }
        }
    }
    //dist = dist ** 2 / maxDist * 255;
    //dist = dist > 200 ? 0 : 255 - dist;
    return 1 - dist;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function random(x, y) {
    return Math.abs((Math.sin(dot(x, y, 12.9898, 78.233)) * 43758.5453123) % 1);
}
function random2(x, y) {
    return {
        x: Math.abs((Math.sin(dot(x, y, 12.9898, 78.233)) * 43758.5453123) % 1),
        y: Math.abs((Math.sin(dot(x, y, 34.6794, 23.978)) * 27045.2385390) % 1)
    };
}

function dot(x0, y0, x1, y1) {
    return x0 * x1 + y0 * y1;
}

function mix(x, y, a) {
    return x * (1 - a) + y * a;
}
