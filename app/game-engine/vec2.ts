export interface Vec2_T {
    x: number;
    y: number;
}

export type Vec2_C = { readonly [K in keyof Vec2_T]: Vec2_T[K]; }

export class Vec2 implements Vec2_T {

    static readonly ZERO: Vec2_C = { x: 0, y: 0 };
    static readonly LEFT: Vec2_C = { x: -1, y: 0 };
    static readonly UP: Vec2_C = { x: 0, y: 1 };
    static readonly RIGHT: Vec2_C = { x: 1, y: 0 };
    static readonly DOWN: Vec2_C = { x: 0, y: -1 };
    
    get x() {
        return this.x_;
    };

    get y() {
        return this.y_;
    };

    set x(value: number) {
        this.x_ = value;
    };

    set y(value: number) {
        this.y_= value;
    };

    get vec2_t(): Vec2_T {
        return { x: this.x, y: this.y };
    };

    get magnitude() {
        return Math.sqrt(this.squared_length);
    };

    get squared_length() {
        return this.x ** 2 + this.y ** 2;
    };

    constructor(vec?: Vec2_T) {
        if (vec) {
            this.copy(vec);
        }
        else {
            this.x_ = 0;
            this.y_ = 0;
        }
    };

    static fromArray(array: number[]) {
        return new Vec2({
            x: array[0] || 0,
            y: array[1] || 0
        });
    };

    static magnitude(a: Vec2_T) {
        return Math.sqrt(a.x ** 2 + a.y ** 2);
    };

    static squaredLength(a: Vec2_T) {
        return a.x ** 2 + a.y ** 2;
    };

    static dot(a: Vec2_T, b: Vec2_T) {
        return a.x * b.x + a.y * b.y;
    };

    // Gives the signed area of a parellogram
    static cross(a: Vec2_T, b: Vec2_T) {
        return (a.x * b.y) - (a.y * b.x);
    };

    static scalarCross(a: Vec2_T, s: number): Vec2_T {
        return { x: a.y * -s, y: a.x * s };
    };

    static normalise(a: Vec2_T, out?: Vec2): Vec2_T {
        let length = Vec2.magnitude(a);
        if (length > 0) {
            let factor = 1.0 / length;
            return Vec2.scale(a, factor, out);
        } else {
            if (out) {
                out.setZero();
            }
            return { x: 0, y: 0 };
        }
    };

    static add(a: Vec2_T, b: Vec2_T, out?: Vec2): Vec2_T {
        let sum = {
            x: a.x + b.x,
            y: a.y + b.y
        };
        if (out) {
            out.copy(sum);
        }
        return sum;
    };

    static subtract(a: Vec2_T, b: Vec2_T, out?: Vec2): Vec2_T {
        let diff = {
            x: a.x - b.x,
            y: a.y - b.y
        };
        if (out) {
            out.copy(diff);
        }
        return diff;
    };

    static scale(a: Vec2_T, scalar: number, out?: Vec2): Vec2_T {
        let scaled = {
            x: a.x * scalar,
            y: a.y * scalar
        };
        if (out) {
            out.copy(scaled);
        }
        return scaled;
    };


    static inverse(a: Vec2_T, out?: Vec2): Vec2_T {
        let inverse = {
            x: -a.x + 0,
            y: -a.y + 0
        };
        if (out) {
            out.copy(inverse);
        }
        return inverse;
    };

    /**
     * returns (-y, x)
     */
    static perLeft(a: Vec2_T, out?: Vec2): Vec2_T {
        let left = {
            x: -a.y + 0,
            y: a.x
        };
        if (out) {
            out.copy(left);
        }
        return left;
    };

    /**
     * returns (y, -x)
     */
    static perRight(a: Vec2_T, out?: Vec2): Vec2_T {
        let right = {
            x: a.y,
            y: -a.x + 0
        };
        if (out) {
            out.copy(right);
        }
        return right;
    };

    static stringify(a: Vec2_T) {
        return `x: ${a.x}, y: ${a.y}`;
    };

    static isZero(a: Vec2_T) {
        return a.x === 0 && a.y === 0;
    };

    static areEqual(a: Vec2_T, b: Vec2_T) {
        return a.x === b.x && a.y === b.y;
    };

    static min(a: Vec2_T, b: Vec2_T): Vec2_T {
        const min = (a: number, b: number) => a < b ? a : b;

        return { x: min(a.x, b.x), y: min(a.y, b.y) };
    };

    static max(a: Vec2_T, b: Vec2_T) {
        const max = (a: number, b: number) => a > b ? a : b;

        return { x: max(a.x, b.x), y: max(a.y, b.y) };
    };

    setZero() {
        this.x_ = 0;
        this.y_ = 0;
    };

    copy(v: Vec2_T) {
        this.x_ = v.x;
        this.y_ = v.y;
    };

    private x_: number;
    private y_: number;
};