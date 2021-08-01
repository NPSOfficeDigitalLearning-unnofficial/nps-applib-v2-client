import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { ApprovalStatusEnum, PrivacyStatusEnum } from "../../../../data-structures/app/application-enums";

type StatusColor = "good"|"bad"|"med"|"pending"|"instructor"|"other";
type StatusEnum = ApprovalStatusEnum|PrivacyStatusEnum;

/* eslint-disable @typescript-eslint/naming-convention */
const statusColorMap:{[key in StatusEnum]:StatusColor} = {
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

/** Append the status color modification class to the class string */
export default function statusColorCSSClass(status:StatusEnum) {
    return `-c-${statusColorMap[status]}`;
}