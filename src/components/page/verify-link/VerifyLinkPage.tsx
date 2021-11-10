import React from "react";
import { Trans } from "react-i18next";
import { Redirect, useParams } from "react-router";
import { apiFetch } from "../../../api/apiFetch";
import { SessionData } from "../../../data-structures/session/Session";
import SessionManager from "../../../data-structures/session/SessionManager";
import { ErrorData } from "../../error-display/ErrorDisplay";
import "./verify-link.scss";

class VerificationSender extends React.Component<{token:string,sessionManager:SessionManager,showError:(errData: ErrorData) => void},{redirect:boolean}> {
    constructor(props:VerificationSender["props"]) {
        super(props);
        this.state = {redirect:false};
    }

    async componentDidMount() {
        const res = await apiFetch<undefined,SessionData>(["verify",this.props.token],"POST");
        if (res.type === "data") {
            this.props.sessionManager.set(res.data);
            this.setState({redirect:true});
        } else if (res.type === "error")
            this.props.showError(res);
    }
    render() { 
        return this.state.redirect ? <Redirect to="/admin"/> : <></>;
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function VerifyLinkPage(props:{sessionManager:SessionManager,showError:(errData: ErrorData) => void}):JSX.Element {
    const {token} = useParams<{token:string}>();

    return (
        <main className="VerifyLinkPage">
            <VerificationSender token={token} sessionManager={props.sessionManager} showError={props.showError}/>
            <p><Trans>TODO Verified email, redirecting</Trans> | <code>{token}</code></p>
        </main>
    );
}