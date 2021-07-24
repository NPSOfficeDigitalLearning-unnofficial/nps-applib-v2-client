import React, { ReactNode } from "react";
import Application from "../../../../data-structures/app/Application";
import "./AppElt.scss";
import ButtonRow from "./ButtonRow";
import StatusRow from "./StatusRow";

export default class AppElt extends React.Component<{app:Application}> {
    render():ReactNode {
        const { app } = this.props;
        return (
            <div className="AppElt"><div>
                <div className="-title">{app.name}</div>
                <StatusRow type="approval" status={app.approval}/>
                <StatusRow type="privacy" status={app.privacy}/>
                {"TODO: figure out if user is editor" && <ButtonRow text="test.entry1" linkType="internal" link="/yeet"/>}
                {app.url.length > 0 && <ButtonRow text="test.entry1" linkType="external" link={app.url}/>}
            </div></div>
        );
    }
}