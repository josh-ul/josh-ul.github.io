function smoothGradient(a) {
    const t = new Uint8Array(a * a * 4);

    let i, j = 0;
    for (j; j < a; j++) {
        i = 0;
        let jj = j * a * 4;
        for (i; i < a; i++) {
            let ii = jj + i * 4;
            t[ii] = t[ii + 1] = t[ii + 2] = t[ii + 3] = (i * 128 / a) + (j * 128 / a);
        }
    }
    return {
        image: t,
        width: a,
        height: a
    };
}
