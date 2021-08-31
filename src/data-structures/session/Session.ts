export interface SessionData {
    id:string;
    email:string;
    isEditor:boolean;
    isAdmin:boolean;
}

export default class Session implements SessionData {
    readonly id: string;
    readonly email: string;
    isEditor: boolean;
    isAdmin: boolean;

    constructor(data:SessionData) {
        this.id = data.id;
        this.email = data.email;
        this.isEditor = data.isEditor;
        this.isAdmin = data.isAdmin;
    }

    setPermission(which:"editor"|"admin",value:boolean):void {
        switch(which) {
        case "editor": this.isEditor = value; break;
        case "admin": this.isAdmin = value; break;
        }
    }
}