import React, { ReactNode } from "react";
import { Trans, Translation } from "react-i18next";
import { Link } from "react-router-dom";
import { prependHttpsToURL } from "../../../../util/link-util";

export default class ButtonRow extends React.Component<{text:string,appName:string,linkType:"internal"|"external",link:string}> {
    render():ReactNode {
        const { text, appName } = this.props;
        const urlHttps = prependHttpsToURL(this.props.link);
        return (
            <Translation>{t=>(
            <div className="-ButtonRow">{
                this.props.linkType === "internal" ?
                <Link to={this.props.link} aria-label={t(text+"-ariaLabel",{replace:{appName}})}>{t(text)}</Link> :
                <a href={urlHttps} target="_blank" rel="noreferrer noopener" aria-label={t(text+"-ariaLabel",{replace:{appName}})}>{t(text)}</a>
            }</div>
            )}</Translation>
        );
    }
}