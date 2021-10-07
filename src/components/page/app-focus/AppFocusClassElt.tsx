import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { Redirect } from "react-router";
import Application from "../../../data-structures/app/Application";
import { APPROVAL_STATUSES, GRADE_LEVELS, PLATFORMS, PRIVACY_STATUSES, SUBJECTS } from "../../../data-structures/app/application-enums";
import UnsavedRedirectBlocker from "../../leaf-component/UnsavedRouteBlocker/UnsavedRedirectBlocker";
import AppEditorEnum from "./edit/AppEditorEnumRow";

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
                {this.props.canEdit ? (
                    <>
                        <p><Trans>{`page.app.savedBlurb.${unsaved}`}</Trans></p>
                        <input value={app.name} onChange={v=>this.editText("name",v.target.value)}/>
                        <input value={app.url}  onChange={v=>this.editText("url", v.target.value)}/>
                        <AppEditorEnum onlyOne name="approval"  options={APPROVAL_STATUSES} value={app.approval}  onChange={v=>this.editOneEnum("approval",v)}/>
                        <AppEditorEnum onlyOne name="privacy"   options={PRIVACY_STATUSES}  value={app.privacy}   onChange={v=>this.editOneEnum("privacy", v)}/>
                        <AppEditorEnum         name="grades"    options={GRADE_LEVELS}      value={app.grades}    onChange={v=>this.editManyEnum("grades",   new Set(v))}/>
                        <AppEditorEnum         name="platforms" options={PLATFORMS}         value={app.platforms} onChange={v=>this.editManyEnum("platforms",new Set(v))}/>
                        <AppEditorEnum         name="subjects"  options={SUBJECTS}          value={app.subjects}  onChange={v=>this.editManyEnum("subjects", new Set(v))}/>
                        <button onClick={this.showConfirmDelete}><Trans>page.app.delete.delete</Trans></button>
                    </>
                ) : (
                    "no edit"
                )}
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