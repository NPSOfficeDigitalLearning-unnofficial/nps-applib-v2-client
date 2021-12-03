type LSVType = "float"|"int"|"string";

type LSVRealType = {float:number,int:number,string:string};

export default class LocalStorageVar<K extends LSVType> {
    constructor(private readonly key:string, private readonly type:K, private readonly defaultValue:LSVRealType[K]) {}

    get value():LSVRealType[K]  { return this.getData() ?? this.defaultValue }
    set value(v:LSVRealType[K]) { this.setData(v) }


    getData():LSVRealType[K]|null {
        const data = localStorage.getItem(this.key);
        if (data === null) return null;
        switch (this.type) {
        case "int":
            const n = parseInt(data);
            return isFinite(n) ? n as LSVRealType[K] : null;
        case "float": return parseFloat(data) as LSVRealType[K];
        case "string": return data as LSVRealType[K];
        default: return null;
        }
    }
    setData(value:LSVRealType[K]) {
        let data = "";
        switch (this.type) {
        case "int":
            if (!Number.isInteger(value))
                throw new Error("invalid assignment of int value");
            data = value.toString();
            break;
        case "float": data = value.toString(); break;
        case "string": data = value as string; break;
        default: throw new Error("no type in LocalStorageVar, should not happen");
        }
        localStorage.setItem(this.key,data);
    }
};