export class Float32 {
    get length() { return this.array.length; };
    get value() { return this.array[0]; };

    private array: Float32Array;

    constructor(value: number) {
        this.array = Float32Array.from([value]);
    }
};