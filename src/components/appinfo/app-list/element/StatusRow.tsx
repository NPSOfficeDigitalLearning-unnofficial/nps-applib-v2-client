import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { ApprovalStatusEnum, PrivacyStatusEnum } from "../../../../data-structures/app/application-enums";

type StatusColor = "good"|"bad"|"med"|"pending"|"instructor"|"other";

/* eslint-disable @typescript-eslint/naming-convention */
const statusColorMap:{[key in ApprovalStatusEnum|PrivacyStatusEnum]:StatusColor} = {
    "APPROVED": "good",
    "COMPLIANT": "good",
    "NO_INFO_COLLECTED": "good",
    "PENDING": "pending",
    "PILOT": "pending",
    "INSTRUCTOR_ONLY": "instructor",
    "14_PARENTAL_CONSENT": "med",
    "PARENTAL_CONSENT": "med",
    "PARENT_INFORMED": "med",
    "DENIED": "bad",
    "NONCOMPLIANT": "bad",
    "NOT_APPLICABLE": "other",
    "UNK": "other"
}; /* eslint-enable @typescript-eslint/naming-convention */

export default class StatusRow extends React.Component<{type:"approval",status:ApprovalStatusEnum}|{type:"privacy",status:PrivacyStatusEnum}> {
    render():ReactNode {
        const color:StatusColor = statusColorMap[this.props.status];
        return (
            <div className={`-StatusRow -c-${color}`}>
                <Trans>{`app.${this.props.type}.${this.props.status}`}</Trans>
            </div>
        );
    }
}