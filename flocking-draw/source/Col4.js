class Col4 {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static random() {
        return new Col4(Util.randInt(0,255), Util.randInt(0,255), Util.randInt(0,255), 1);
    }

    get rgba() {
        return "rgba(" +
            this.r.toString() + "," +
            this.g.toString() + "," +
            this.b.toString() + "," +
            this.a.toString() + ")";
    }

    get hex() {
        let hex = this.toHex();
        return '#' + hex[0] + hex[1] +hex[2] + hex[3];
    }

    get hsla() {
        let hsla = this.toHsla();
        return "hsla(" +
            (hsla.h * 360).toString() + "," +
            (hsla.s * 100).toString() + "%," +
            (hsla.l * 100).toString() + "%," +
            hsla.a.toString() + ")";
    }

    get hsva() {
        let hsla = this.toHsva();
        return "hsla(" +
            hsva.h.toString() + "," +
            hsva.s.toString() + "," +
            hsva.v.toString() + "," +
            hsva.a.toString() + ")";
    }

    toHex() {
        return [
            ("0" + this.r.toString(16)).slice(-2),
            ("0" + this.g.toString(16)).slice(-2),
            ("0" + this.b.toString(16)).slice(-2),
            (this.a * 255).toString(16).substring(0,2)
        ];
        //return (this.r, this.g, this.b) => ((r << 16) + (g <<8) + b).toString(16).padStart(6, "0");
    }

    toHsla() {
        let r = Util.bound(this.r, [0, 255], [0, 1]),
            g = Util.bound(this.g, [0, 255], [0, 1]),
            b = Util.bound(this.b, [0, 255], [0, 1]);

        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);

        let h, s, l = (max + min) * 0.5;

        if (max == min) h = s = 0;
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return {h: h, s: s, l: l, a: this.a};
    }

    toHsva() {
        let r = Util.bound(this.r, [0, 255], [0, 1]),
            g = Util.bound(this.g, [0, 255], [0, 1]),
            b = Util.bound(this.b, [0, 255], [0, 1]);

        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);

        let h, s, v = max;
        let d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max == min) h = 0;
        else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return {h: h, s: s, v: v, a: this.a};
    }
}
