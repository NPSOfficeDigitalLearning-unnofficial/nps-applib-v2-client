import { ErrorData } from "../components/error-display/ErrorDisplay";

const CURRENCY_FETCH_COOLDOWN = 10000; // 10s minimum between fetchCurrent calls.

export default abstract class DataManager<ChangeHandler extends (...args:any[])=>void> {
    
    private lastCurrencyFetch:number = -Infinity;
    protected checkNeedsFetch():boolean {
        return this.lastCurrencyFetch+CURRENCY_FETCH_COOLDOWN < Date.now();
    }
    protected onFetchComplete() { this.lastCurrencyFetch = Date.now() }

    abstract fetchCurrent():Promise<void|ErrorData>;

    
    private readonly _changeHandlers:Set<ChangeHandler> = new Set();

    addChangeHandler   (callback:ChangeHandler):void { this._changeHandlers.add   (callback) }
    removeChangeHandler(callback:ChangeHandler):void { this._changeHandlers.delete(callback) }
    clearChangeHandlers():void                       { this._changeHandlers.clear ()         }

    protected _callChangeHandlers(...data:Parameters<ChangeHandler>):void {
        for (const handler of this._changeHandlers.values())
            handler(...data);
    }
}
