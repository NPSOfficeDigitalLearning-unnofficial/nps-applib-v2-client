import React, { ReactNode } from "react";
import { ApprovalStatusEnum, PrivacyStatusEnum } from "../../../../data-structures/app/application-enums";

export default class StatusRow extends React.Component<{type:"approval",status:ApprovalStatusEnum}|{type:"privacy",status:PrivacyStatusEnum}> {
    render():ReactNode {
        return (
            <div className="-StatusRow">
                {`TODO status:"${this.props.status}"`}
            </div>
        );
    }
}