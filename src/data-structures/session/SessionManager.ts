import { APIErrorResponse } from "../../api/api-types";
import { apiFetch } from "../../api/apiFetch";
import { ErrorData } from "../../components/error-display/ErrorDisplay";
import Session, { SessionData } from "./Session";

type SessionChangeHandler = (manager:SessionManager,newSession:Session|null)=>void;

function apiErrResData(res:APIErrorResponse):ErrorData {
    const { error, moreInfo } = res;
    return { error, detail: moreInfo };
}

export default class SessionManager {
    
    private _currentSession:Session|null = null;
    public get currentSession():Session|null { return this._currentSession }
    public set currentSession(value:Session|null) {
        this._currentSession = value;
        this.onSessionChange();
    }

    /** Use the API to fetch data on the current logged in user. */
    async fetchCurrentSession():Promise<void|ErrorData> {
        // use `GET /api/session` to get the current session data.
        const res = await apiFetch<never,SessionData&{loggedIn:true}|{loggedIn:false}>(["session"],"GET");
        if (res.type === "data")
            this.currentSession = res.data.loggedIn ? new Session(res.data) : null;
        else if (res.type === "error") {
            this.currentSession = null;
            return apiErrResData(res);
        }
    }

    /** Use the API to log the user in. */
    async login(email:string,password:string):Promise<void|{error:string,moreInfo?:string}> {
        // use `POST /api/session` to log the user in.
        const res = await apiFetch<{email:string,password:string},SessionData>(["session"],"POST",{email,password});

        if (res.type === "data")
            this.currentSession = new Session(res.data);
        else if (res.type === "error") {
            this.currentSession = null;
            return apiErrResData(res);
        }
    }

    /** Use the API to log out the user. */
    async logout():Promise<void|ErrorData> {
        // use `DELETE /api/session` to log the user out.
        const res = await apiFetch<never,SessionData>(["session"],"DELETE");
        
        this.currentSession = null;
        if (res.type === "error")
            return apiErrResData(res);
    }

    private readonly _sessionChangeHandlers:Set<SessionChangeHandler> = new Set();

    addChangeHandler   (callback:SessionChangeHandler):void { this._sessionChangeHandlers.add   (callback) }
    removeChangeHandler(callback:SessionChangeHandler):void { this._sessionChangeHandlers.delete(callback) }
    clearChangeHandlers():void                              { this._sessionChangeHandlers.clear ()         }
    private onSessionChange():void {
        for (let handler of this._sessionChangeHandlers.values())
            handler(this,this.currentSession);
    };
}