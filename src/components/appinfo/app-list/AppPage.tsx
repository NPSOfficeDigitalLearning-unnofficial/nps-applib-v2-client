import React, { ReactNode } from "react";
import Application from "../../../data-structures/app/Application";
import AppElt from "./element/AppElt";

export default class AppPage extends React.Component<{apps:Application[]}> {
    render():ReactNode {
        return (
            <div className="AppPage">{
                this.props.apps.map(v=>(
                    <AppElt key={v._reactInstanceKey} app={v}/>
                ))
            }</div>
        );
    }
}