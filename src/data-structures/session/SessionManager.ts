import { apiFetch } from "../../api/apiFetch";
import { ErrorData } from "../../components/error-display/ErrorDisplay";
import { apiErrResData } from "../apiErrResData";
import DataManager from "../DataManager";
import Session, { SessionData } from "./Session";

export type SessionChangeHandler = (manager:SessionManager,newSession:Session|null)=>void;

export default class SessionManager extends DataManager<SessionChangeHandler> {
    
    private _currentSession:Session|null = null;
    public get currentSession():Session|null { return this._currentSession }
    public set currentSession(value:Session|null) {
        this._currentSession = value;
        this.onSessionChange();
        
    }

    /** Use the API to fetch data on the current logged in user. */
    async fetchCurrent():Promise<void|ErrorData> {
        if (!this.checkNeedsFetch()) return;
        // use `GET /api/session` to get the current session data.
        const res = await apiFetch<never,SessionData&{loggedIn:true}|{loggedIn:false}>(["session"],"GET");
        this.onFetchComplete();
        if (res.type === "data")
            this.currentSession = res.data.loggedIn ? new Session(res.data) : null;
        else if (res.type === "error") {
            this.currentSession = null;
            return apiErrResData(res);
        }
    }

    set(data:SessionData):void {
        this.currentSession = new Session(data);
    }

    /** Use the API to log the user in. */
    async login(email:string,password:string):Promise<void|ErrorData> {
        // use `POST /api/session` to log the user in.
        const res = await apiFetch<{email:string,password:string},SessionData>(["session"],"POST",{email,password});

        if (res.type === "data")
            this.currentSession = new Session(res.data);
        else if (res.type === "error") {
            this.currentSession = null;
            return apiErrResData(res);
        }
    }

    /** Use the API to sign the user up. */
    async signup(email:string,password:string):Promise<boolean|ErrorData> {
        // use `POST /api/user` to sign the user up.
        const res = await apiFetch<{email:string,password:string},SessionData>(["user"],"POST",{email,password});

        if (res.type === "data") {
            this.currentSession = new Session(res.data);
            return true;
        } else if (res.type === "error") {
            this.currentSession = null;
            return apiErrResData(res);
        } else 
            return false;
    }

    /** Use the API to log out the user. */
    async logout():Promise<void|ErrorData> {
        // use `DELETE /api/session` to log the user out.
        const res = await apiFetch<never,SessionData>(["session"],"DELETE");
        
        this.currentSession = null;
        if (res.type === "error")
            return apiErrResData(res);
    }

    
    /** Use the API to change the user's password. */
    async setPassword(password:string):Promise<void|ErrorData> {
        // use `PATCH /api/user` to edit the user account.
        const res = await apiFetch<{password:string},SessionData>(["user"],"PATCH",{password});

        if (res.type === "error") 
            return apiErrResData(res);
    }

    /** Private function which is called to update the client of changes. */
    private onSessionChange():void {
        this._callChangeHandlers(this,this.currentSession);
    };
}