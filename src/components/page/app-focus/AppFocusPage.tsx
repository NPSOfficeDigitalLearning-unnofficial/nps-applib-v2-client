import React from "react";
import { Trans } from "react-i18next";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Application from "../../../data-structures/app/Application";
import AppFocus from "../../appinfo/focus-popup/AppFocus";
import "./app-focus-common.scss";

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function AppFocusPage(props:{apps:Application[], onEdit:(app:Application)=>void,onDelete:(app:Application)=>void}):JSX.Element {
    const {id} = useParams<{id:string}>();

    const app = props.apps.find(v=>v.id===id);

    if (!app) {return (
        <div className="AppFocusPage-missing">
            <h1 className="-header"><Trans values={{id}}>page.app.appIdMissing</Trans></h1>
            <Link to="/" className="-goBack"><Trans>page.app.backToMain</Trans></Link>
        </div>
    );} else {return (
        <AppFocus app={app} onEdit={()=>props.onEdit(app)} onDelete={()=>props.onDelete(app)} />
    );}
}