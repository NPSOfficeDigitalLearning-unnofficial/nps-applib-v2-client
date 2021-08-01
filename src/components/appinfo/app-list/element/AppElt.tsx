import React, { ReactNode } from "react";
import Application from "../../../../data-structures/app/Application";
import "./AppElt.scss";
import ButtonRow from "./ButtonRow";
import statusColorCSSClass from "./status-colors";
import StatusRow from "./StatusRow";

export default class AppElt extends React.Component<{app:Application}> {
    render():ReactNode {
        const { app } = this.props;
        return (
            <div className="AppElt"><div>
                <div className={["-title","-c-",statusColorCSSClass(app.approval)].join(" ")}>
                    <span>{app.name}</span>
                </div>
                <StatusRow type="approval" status={app.approval}/>
                <StatusRow type="privacy" status={app.privacy}/>
                <div className="-buttons">
                    <ButtonRow text={`app.summary.button.${"TODO: is editor"?"edit":"info"}`} linkType="internal" link="TODO editor page of app"/>
                </div>
            </div></div>
        );
    }
}