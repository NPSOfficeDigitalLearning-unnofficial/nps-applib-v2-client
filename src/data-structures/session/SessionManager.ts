import { apiFetch } from "../../api/apiFetch";
import Session, { SessionData } from "./Session";

type SessionChangeHandler = (manager:SessionManager,newSession:Session|null)=>void;

export default class SessionManager {
    
    private _currentSession:Session|null = null;
    public get currentSession():Session|null { return this._currentSession }
    public set currentSession(value:Session|null) {
        this._currentSession = value;
        this.onSessionChange();
    }

    /** Use the API to fetch data on the current logged in user. */
    async fetchCurrentSession():Promise<void> {
        // use `GET /api/session` to get the current session data.
        const session = await apiFetch<never,SessionData&{loggedIn:true}|{loggedIn:false}>(["session"],"GET");
        if (session.type === "data")
            this.currentSession = session.data.loggedIn ? new Session(session.data) : null;
        else // TODO handle error.
            this.currentSession = null;
    }

    /** Use the API to log the user in. */
    async login(email:string,password:string):Promise<void> {
        // use `POST /api/session` to log the user in.
        const session = await apiFetch<{email:string,password:string},SessionData>(["session"],"POST",{email,password});
        
        console.log(session);
        

        if (session.type === "data")
            this.currentSession = new Session(session.data);
        else // TODO handle error.
            this.currentSession = null;
    }

    /** Use the API to log out the user. */
    async logout():Promise<void> {
        // use `DELETE /api/session` to log the user out.
        await apiFetch<never,SessionData>(["session"],"DELETE");
        
        this.currentSession = null;
        // TODO handle error.
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