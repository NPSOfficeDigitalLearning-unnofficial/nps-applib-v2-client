import { apiFetch } from "../../api/apiFetch";
import Session, { SessionData } from "./Session";

type SessionChangeHandler = (manager:SessionManager,newSession:Session)=>void;

export default class SessionManager {
    
    currentSession:Session|null = null;

    /** Use the API to fetch data on the current logged in user. */
    async fetchCurrentSession():Promise<void> {
        // use `GET /api/session` to get the current session data.
        const session = await apiFetch<never,SessionData>(["session"],"GET");
        if (session.data.type === "data")
            this.currentSession = new Session(session.data.data);
        else // TODO handle error.
            this.currentSession = null;
    }

    /** Use the API to log the user in. */
    async login(email:string,password:string):Promise<void> {
        // use `POST /api/session` to log the user in.
        const session = await apiFetch<{email:string,password:string},SessionData>(["session"],"POST",{email,password});
        
        if (session.data.type === "data")
            this.currentSession = new Session(session.data.data);
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
    private onSessionChange:SessionChangeHandler = (manager,newSession)=>{
        for (let handler of this._sessionChangeHandlers.values())
            handler(manager,newSession);
    };
}