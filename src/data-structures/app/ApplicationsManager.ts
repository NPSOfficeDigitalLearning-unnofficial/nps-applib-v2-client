import { apiFetch } from "../../api/apiFetch";
import { ErrorData } from "../../components/error-display/ErrorDisplay";
import i18n from "../../i18n";
import { copySetContents, findChanges } from "../../util/data-util";
import { apiErrResData } from "../apiErrResData";
import DataManager from "../DataManager";
import Application from "./Application";
import ApplicationInit from "./ApplicationInit";

export type AppsChangeWhat = "add"|"del"|"edit";
export type AppsChangeHandler = (manager:ApplicationsManager,what:AppsChangeWhat,changedData:Application[])=>void;

export default class ApplicationsManager extends DataManager<AppsChangeHandler> {
    
    /** Use api to fetch information about all apps in the db. */
    async fetchCurrent():Promise<void|ErrorData> {
        if (!this.checkNeedsFetch()) return;
        // Use `GET /api/app` to get the apps.
        const res = await apiFetch<never,ApplicationInit[]>(["app"],"GET");
        this.onFetchComplete();
        let ret:ErrorData|void;
        if (res.type === "data") {
            this._allApps.clear();
            res.data.forEach(v=>this._allApps.add(new Application(v)));
        } else if (res.type === "error") {
            this._allApps.clear();
            ret = apiErrResData(res);
        }
        this._onAppsChange();
        return ret;
    }

    /** A set containing all the apps, kept up to date by fetchCurrent. */
    private readonly _allApps:Set<Application> = new Set();
    /** Copy of _allApps before the last onChange for tracking differences. */
    private readonly _lastAllApps:Set<Application> = new Set();

    /** Public accessor for the list of all apps. */
    get allApps():Application[] { return [... this._allApps] }

    
    /** Create a new app and return it. */
    public async createApp():Promise<Application|ErrorData> {
        // Create default empty app data. 
        const defaultData:Required<Omit<ApplicationInit,"id">> = {
            name: i18n.t("app.name.default"),
            url: "", approval: "UNK", privacy: "UNK",
            grades: [], platforms: [], subjects: []
        }; 
        // Use `POST /api/app` to create it.
        const res = await apiFetch<Required<Omit<ApplicationInit,"id">>,ApplicationInit>(["app"],"POST",defaultData);
        // Parse response.
        if (res.type === "data") {
            const app = new Application(res.data);
            this._allApps.add(app);
            this._onAppsChange();
            return app;
        } else if (res.type === "error")
            return apiErrResData(res);
        else
            throw new Error("POST /api/app responded with type other than data or error, should not happen");
    }


    /** Called when the contents of _allApps is changed significantly in order to update things which need to be updated idk. */
    private _onAppsChange():void {
        const {added,changed,removed} = findChanges([...this._lastAllApps],[...this._allApps],Application.equals);
        const changes:{[k in AppsChangeWhat]:Application[]} = {
            add:added,del:removed,edit:changed
        };
        for (const what_ in changes) {
            const what = what_ as AppsChangeWhat;
            if (changes[what].length > 0)
                this._callChangeHandlers(this,what,changes[what]);
        }
        copySetContents(this._allApps,this._lastAllApps);
    };
}
