export class Uint32 {
    get length() { return this.array.length; };
    get value() { return this.array[0]; };

    private array: Uint32Array;

    constructor(value: number) {
        this.array = Uint32Array.from([value]);
    }
};