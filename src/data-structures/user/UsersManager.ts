import { apiFetch } from "../../api/apiFetch";
import { ErrorData } from "../../components/error-display/ErrorDisplay";
import { copySetContents, findChanges } from "../../util/data-util";
import { apiErrResData } from "../apiErrResData";
import DataManager from "../DataManager";
import Session, { SessionData } from "../session/Session";

export type UsersChangeWhat = "add"|"del"|"edit";
export type UsersChangeHandler = (manager:UsersManager,what:UsersChangeWhat,changedData:Session[])=>void;

export default class UsersManager extends DataManager<UsersChangeHandler> {
    

    /** Use api to fetch information about all users in the db. */
    async fetchCurrent():Promise<void|ErrorData> {
        if (!this.checkNeedsFetch()) return;
        // Use `GET /api/user` to get all the users.
        const res = await apiFetch<never,SessionData[]>(["user"],"GET");
        this.onFetchComplete();
        let ret:ErrorData|void;
        if (res.type === "data") {
            
            this._allUsers.clear();
            res.data.forEach(v=>this._allUsers.add(new Session(v)));
        } else if (res.type === "error") {
            this._allUsers.clear();
            ret = apiErrResData(res);
        }
        this._onUsersChange();
        return ret;
    }

    /** A set containing all the users, kept up to date by fetchCurrent. */
    private readonly _allUsers:Set<Session> = new Set();
    /** Copy of _allUsers before the last onChange for tracking differences. */
    private readonly _lastAllUsers:Set<Session> = new Set();

    /** Public accessor for the list of all apps. */
    get allUsers():Session[] { return [... this._allUsers] }



    async patchUser(id:string, change:(s:Session)=>void):Promise<void|ErrorData> {
        const s = [...this._allUsers].find(v=>v.id===id);
        if (s) {
            change(s);
            const res = await apiFetch<SessionData,never>(["user",id],"PATCH",s);
            let ret:ErrorData|void;
            if (res.type === "error")
                ret = apiErrResData(res);
            this._onUsersChange();
            return ret;
        }
    }

    
    /** Called when the contents of _allApps is changed significantly in order to update things which need to be updated idk. */
    private _onUsersChange():void {
        const {added,changed,removed} = findChanges([...this._lastAllUsers],[...this._allUsers],(a,b)=>a.isAdmin===b.isAdmin&&a.isEditor===b.isEditor);
        const changes:{[k in UsersChangeWhat]:Session[]} = {
            add:added,del:removed,edit:changed
        };
        
        for (const what_ in changes) {
            const what = what_ as UsersChangeWhat;
            if (changes[what].length > 0)
                this._callChangeHandlers(this,what,changes[what]);
        }
        
        copySetContents(this._allUsers,this._lastAllUsers,v=>new Session(v));
    };
}
