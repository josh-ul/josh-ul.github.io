function createCheckerPattern(a) {
    const checker = [];
    let i, j = 0;
    for (j; j < a; j++) {
        i = 0;
        for (i; i < a; i++) {
            if ((i + j) % 2 === 0) checker.push(127 + 127 * Math.random(), 127 + 127 * Math.random(), 127 + 127 * Math.random(), 255);
            else checker.push(127 + 127 * Math.random(), 127 + 127 * Math.random(), 127 + 127 * Math.random(), 255);
        }
    }
    return {
        image: new Uint8Array(checker),
        width: a,
        height: a
    };
}
