import React, { ReactNode } from "react";
import { Trans } from "react-i18next";

export default class SettingsRow extends React.Component<{label:string,children:ReactNode}> {
    render():ReactNode {
        return (
            <div className="-SettingsRow">
                <label><Trans>{this.props.label}</Trans></label>
                <div>{this.props.children}</div>
            </div>
        );
    }
}
