import React, { ReactNode } from "react";
import Application from "../../../data-structures/app/Application";
import { APPROVAL_STATUSES, GRADE_LEVELS, PLATFORMS, PRIVACY_STATUSES, SUBJECTS } from "../../../data-structures/app/application-enums";
import UnsavedRedirectBlocker from "../../leaf-component/UnsavedRouteBlocker/UnsavedRedirectBlocker";
import AppEditorEnum from "./edit/AppEditorEnumRow";

const SAVE_DELAY = 1000;

export default class AppFocusClass extends React.Component<{app:Application,canEdit:boolean,onEdit:()=>void,onDelete:()=>void},{unsaved:boolean}> {
    constructor(props:AppFocusClass["props"]) {
        super(props);
        this.state = {unsaved:false};
    }

    async doSave() {
        this.clearSaveTimeout();
        this.props.onEdit();
        await this.setUnsaved(false);
    }


    private saveTimeout?:number;
    setSaveTimeout()   { clearTimeout(this.saveTimeout); this.saveTimeout = setTimeout(this.doSave, SAVE_DELAY) as never }
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
        
    }
    editManyEnum<T extends "grades"|"platforms"|"subjects">(key:T,value:Application[T]) {
        const { app } = this.props;
        app[key] = value;
        
    }


    render():ReactNode {
        const { app } = this.props;
        return (
            <main className="AppFocusPage">
                <UnsavedRedirectBlocker unsaved={true}/>
                {this.props.canEdit ? (
                    <>
                        <AppEditorEnum onlyOne name="approval"  options={APPROVAL_STATUSES} value={app.approval}  onChange={v=>this.editOneEnum("approval",v)}/>
                        <AppEditorEnum onlyOne name="privacy"   options={PRIVACY_STATUSES}  value={app.privacy}   onChange={v=>this.editOneEnum("privacy", v)}/>
                        <AppEditorEnum         name="grades"    options={GRADE_LEVELS}      value={app.grades}    onChange={v=>this.editManyEnum("grades",   new Set(v))}/>
                        <AppEditorEnum         name="platforms" options={PLATFORMS}         value={app.platforms} onChange={v=>this.editManyEnum("platforms",new Set(v))}/>
                        <AppEditorEnum         name="subjects"  options={SUBJECTS}          value={app.subjects}  onChange={v=>this.editManyEnum("subjects", new Set(v))}/>
                    </>
                ) : (
                    "no edit"
                )}
                {`app [#${this.props.app.id}]`}
            </main>
        );
    }
}