import React from "react";
import { Trans } from "react-i18next";
import "./verify-link.scss";

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function VerifyLinkAlertPage():JSX.Element {
    return (
        <main className="VerifyLinkAlertPage">
            <h1><Trans>page.verify-link-alert.blurb</Trans></h1>
        </main>
    );
}