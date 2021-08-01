import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { ApprovalStatusEnum, PrivacyStatusEnum } from "../../../../data-structures/app/application-enums";
import statusColorCSSClass from "./status-colors";

export default class StatusRow extends React.Component<{type:"approval",status:ApprovalStatusEnum}|{type:"privacy",status:PrivacyStatusEnum}> {
    render():ReactNode {
        return (
            <div className={["-StatusRow","-c-",statusColorCSSClass(this.props.status)].join(" ")}>
                <Trans>{`app.${this.props.type}.${this.props.status}`}</Trans>
            </div>
        );
    }
}