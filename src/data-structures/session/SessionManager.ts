import { apiFetch } from "../../api/apiFetch";
import Session, { SessionData } from "./Session";

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
}