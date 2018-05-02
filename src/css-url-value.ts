export class CSSUrlValue {

    constructor(public value: string) {}

    get isRemote(): boolean {
        return this.value.match(/^https*/i) != null;
    }

}