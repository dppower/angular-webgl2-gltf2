
export class Color {

    get length() { return 4; };
    get r() { return this.color_[0]; };
    get g() { return this.color_[1]; };
    get b() { return this.color_[2]; };
    get a() { return this.color_[3]; };

    get array() { return this.color_; };

    set r(value: number) {
        let clamped_value = (value < 0) ? 0.0 : ((value > 1) ? 1 : value);
        this.color_[0] = clamped_value;
    };

    set g(value: number) {
        let clamped_value = (value < 0) ? 0.0 : ((value > 1) ? 1 : value);
        this.color_[1] = clamped_value;
    };

    set b(value: number) {
        let clamped_value = (value < 0) ? 0.0 : ((value > 1) ? 1 : value);
        this.color_[2] = clamped_value;
    };

    set a(value: number) {
        let clamped_value = (value < 0) ? 0.0 : ((value > 1) ? 1 : value);
        this.color_[3] = clamped_value;
    };

    constructor(r = 1.0, g = 1.0, b = 1.0, a = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    };

    static fromArray(array: number[]) {
        let color = new Color();
        color.r = array[0];
        color.g = array[1];
        color.b = array[2];
        color.a = array[3];
        return color;
    };

    private color_ = new Float32Array(4);
};