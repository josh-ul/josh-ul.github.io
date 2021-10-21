self.addEventListener("message", e => {
    self.postMessage(serp(...e.data));
});

function serp(tri, depth) {
    let tris = [tri];
    if (depth > 0) rec(tri, depth - 1);
    return tris;

    function rec(tri, depth) {
        let ab = half(tri[0], tri[1]),
            bc = half(tri[1], tri[2]),
            ca = half(tri[2], tri[0]);
        tris.push([ab, bc, ca]);

        if (depth <= 0) return;
        depth--;
        //rec([ab, bc, ca], depth - 2);
        rec([tri[0], ab, ca], depth);
        rec([ab, tri[1], bc], depth);
        rec([ca, bc, tri[2]], depth);
    }

    function half(a, b) {
        return [(a[0] + b[0]) * .5, (a[1] + b[1]) * .5];
    }
}
