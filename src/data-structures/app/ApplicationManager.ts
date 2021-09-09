import { ErrorData } from "../../components/error-display/ErrorDisplay";
import DataManager from "../DataManager";
import Application from "./Application";

type AppsChangeWhat = "add"|"del"|"edit";
type AppsChangeHandler = (manager:ApplicationManager,what:AppsChangeWhat,changedData:Application[])=>void;

export default class ApplicationManager extends DataManager<AppsChangeHandler> {
    
    async fetchCurrent():Promise<void|ErrorData> {

    }

    /** A set containing all the apps, kept up to date by fetchCurrent. */
    private readonly _allApps:Set<Application> = new Set();
    /** Copy of _allApps before the last onChange for tracking differences. */
    private readonly _lastAllApps:Set<Application> = new Set();





    private onAppsChange():void {
        const newApps:{[k:string]:Application} = {}, deletedApps:{[k:string]:Application} = {}, editedApps:{[k:string]:Application} = {};

        // Compute changes
        for (const app of this._allApps) // Apps we have now could have been added.
            if (app.id) newApps[app.id] = app;
        for (const app of this._lastAllApps) {
            if (app.id) {
                if (newApps[app.id]) { // Apps we had before can't be new
                    if (!Application.equals(app,newApps[app.id]))
                        editedApps[app.id] = app; // Check for edits.
                    delete newApps[app.id];
                }
                deletedApps[app.id] = app;
            }
        }
        for (const app of this._allApps) // If it still exists it wasn't deleted.
            if (app.id) delete deletedApps[app.id];

        // Send changes (if any). TODO
        const changes:{[k in AppsChangeWhat]:Application[]} = {
            add: Object.values(newApps),
            del: Object.values(deletedApps),
            edit: Object.values(editedApps)
        };
        for (const what_ in changes) {
            const what = what_ as AppsChangeWhat;
            if (changes[what].length > 0)
                this._callChangeHandlers(this,what,changes[what]);
        }
    };
}
