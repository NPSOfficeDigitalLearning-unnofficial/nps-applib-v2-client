import React, { ReactNode } from "react";
import { Translation } from "react-i18next";
import Application from "../../../../data-structures/app/Application";
import { APPROVAL_STATUSES, GRADE_LEVELS, PLATFORMS, PRIVACY_STATUSES, SUBJECTS } from "../../../../data-structures/app/application-enums";
import WidthLimiter from "../../../leaf-component/WidthLimiter/WidthLimiter";
import AppFocusClass from "../AppFocusClassElt";
import AppEditorEnum from "./AppEditorEnumRow";
import ERow from "./AppEditorRow";

export default class AppEditor extends React.Component<{unsaved:boolean,app:Application,p:AppFocusClass}> {
    render():ReactNode {
        const {unsaved,app,p} = this.props;
        return (
            <Translation>{t=>(
                <div className="-edit">
                    <WidthLimiter>
                        <p>{t(`page.app.savedBlurb.${unsaved}`)}</p>
                        <ERow><input value={app.name} onChange={v=>p.editText("name",v.target.value)} placeholder={t("app.name.name")} aria-label={t("app.name.name")}/></ERow>
                        <ERow><input value={app.url}  onChange={v=>p.editText("url", v.target.value)} placeholder={t("app.url.name")}  aria-label={t("app.url.name")} /></ERow>
                        <ERow><input value={app.embed}  onChange={v=>p.editText("embed", v.target.value)} placeholder={t("app.embedUrl.name")}  aria-label={t("app.embedUrl.name")} /></ERow>
                        <ERow><AppEditorEnum onlyOne name="approval"  options={APPROVAL_STATUSES} value={app.approval}  onChange={v=>p.editOneEnum("approval",v)}/></ERow>
                        <ERow><AppEditorEnum onlyOne name="privacy"   options={PRIVACY_STATUSES}  value={app.privacy}   onChange={v=>p.editOneEnum("privacy", v)}/></ERow>
                        <ERow><AppEditorEnum         name="grades"    options={GRADE_LEVELS}      value={app.grades}    onChange={v=>p.editManyEnum("grades",   new Set(v))}/></ERow>
                        <ERow><AppEditorEnum         name="platforms" options={PLATFORMS}         value={app.platforms} onChange={v=>p.editManyEnum("platforms",new Set(v))}/></ERow>
                        <ERow><AppEditorEnum         name="subjects"  options={SUBJECTS}          value={app.subjects}  onChange={v=>p.editManyEnum("subjects", new Set(v))}/></ERow>
                        <ERow><button onClick={p.showConfirmDelete}>{t("page.app.delete.delete")}</button></ERow>
                    </WidthLimiter>
                </div>
            )}</Translation>
        );
    }
}