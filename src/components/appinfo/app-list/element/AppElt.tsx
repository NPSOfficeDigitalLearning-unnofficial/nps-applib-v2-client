import React, { ReactNode } from "react";
import Application from "../../../../data-structures/app/Application";
import "./AppElt.scss";
import ButtonRow from "./ButtonRow";
import statusColorCSSClass from "./status-colors";
import StatusRow from "./StatusRow";

export default class AppElt extends React.Component<{app:Application,canEdit:boolean}> {
    render():ReactNode {
        const { app, canEdit } = this.props;
        return (
            <div className="AppElt"><div>
                <div className={["-title","-c-",statusColorCSSClass(app.approval)].join(" ")}>
                    <span>{app.name}</span>
                </div>
                <StatusRow type="approval" status={app.approval}/>
                <StatusRow type="privacy" status={app.privacy}/>
                <div className="-buttons">
                    <ButtonRow
                        text={`app.summary.button.${canEdit?"edit":"info"}`} appName={app.name}
                        linkType="internal" link={`/app/${app.id}`}/>
                </div>
            </div></div>
        );
    }
}