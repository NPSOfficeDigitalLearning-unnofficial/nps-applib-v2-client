import React, { ReactNode } from "react";
import { Translation } from "react-i18next";
import Application from "../../../data-structures/app/Application";
import AppElt from "./element/AppElt";

export default class AppPage extends React.Component<{apps:Application[],canEdit:boolean}> {
    render():ReactNode {
        return (
            <Translation>{t=>(
                <div className="AppPage" role="heading" aria-level={1} aria-label={t("page.main.appsHeadingLabel")}>{
                    this.props.apps.map(v=>(
                        <AppElt key={v._reactInstanceKey} app={v} canEdit={this.props.canEdit}/>
                    ))
                }</div>
            )}</Translation>
        );
    }
}