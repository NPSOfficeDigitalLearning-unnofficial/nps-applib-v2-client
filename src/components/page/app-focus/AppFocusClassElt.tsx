import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Application from "../../../data-structures/app/Application";
import UnsavedRedirectBlocker from "../../leaf-component/UnsavedRouteBlocker/UnsavedRedirectBlocker";
import AppDataView from "./data/AppDataView";
import AppEditor from "./edit/AppEditor";

const SAVE_DELAY = 1000;

export default class AppFocusClass extends React.Component<{app:Application,canEdit:boolean,onEdit:()=>Promise<void>,onDelete:()=>Promise<void>},{unsaved:boolean,deleteConfirm:boolean,deleted:boolean}> {
    constructor(props:AppFocusClass["props"]) {
        super(props);
        this.state = {unsaved:false,deleteConfirm:false,deleted:false};
    }

    async doSave() {
        this.clearSaveTimeout();
        await this.props.onEdit();
        await this.setUnsaved(false);
    }


    private saveTimeout?:number;
    setSaveTimeout()   { clearTimeout(this.saveTimeout); this.saveTimeout = setTimeout(()=>this.doSave(), SAVE_DELAY) as never }
    clearSaveTimeout() { clearTimeout(this.saveTimeout); delete this.saveTimeout }
    private async setUnsaved(unsaved:boolean):Promise<void> {
        if (unsaved !== this.state.unsaved)
            return new Promise(res=>this.setState({unsaved},res));
    }

    async markDirty() {
        await this.setUnsaved(true);
        this.setSaveTimeout();
    }


    editOneEnum<T extends "approval"|"privacy">(key:T,value:Application[T]) {
        const { app } = this.props;
        app[key] = value;
        this.forceUpdate();
        this.markDirty();
    }
    editManyEnum<T extends "grades"|"platforms"|"subjects">(key:T,value:Application[T]) {
        const { app } = this.props;
        app[key].clear();
        value.forEach(v=>app[key].add(v as never));
        this.forceUpdate();
        this.markDirty();   
    }
    editText<T extends "name"|"url">(key:T,value:string)  {
        this.props.app[key] = value;
        this.forceUpdate();
        this.markDirty();
    }

    showConfirmDelete:React.MouseEventHandler = e=>{
        this.setState({deleteConfirm:true});
    };
    cancelDelete:React.MouseEventHandler = e=>{
        this.setState({deleteConfirm:false});
    };
    confirmDelete:React.MouseEventHandler = e=>{
        this.props.onDelete();
        this.setState({deleted:true});
    };



    render():ReactNode {
        const { app } = this.props, { unsaved, deleteConfirm, deleted } = this.state;

        if (deleted)
            return <Redirect to="/"/>;

        return (
            <main className="AppFocusPage">
                <UnsavedRedirectBlocker unsaved={unsaved}/>
                <Link to="/" className="-back"><Trans>page.app.backToMain</Trans></Link>
                {this.props.canEdit && <AppEditor unsaved={unsaved} app={app} p={this} />}
                <AppDataView app={app}/>
                {deleteConfirm && (
                    <div className="-confirmDelete">
                        <button onClick={this.confirmDelete}><Trans values={{name:app.name}}>page.app.delete.confirm</Trans></button>
                        <button onClick={this.cancelDelete}><Trans>page.app.delete.cancel</Trans></button>
                    </div>
                )}
            </main>
        );
    }
}