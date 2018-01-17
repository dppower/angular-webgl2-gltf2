export abstract class glObject {
    constructor(public readonly name?: string) { };
    abstract toGLTF(): object;
    extensions?: object;
    extras?: any;
};