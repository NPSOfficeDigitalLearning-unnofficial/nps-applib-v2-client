import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { prependHttpsToURL } from "../../../../util/link-util";

export default class ButtonRow extends React.Component<{text:string,linkType:"internal"|"external",link:string}> {
    render():ReactNode {
        const text = <Trans>{this.props.text}</Trans>;
        const urlHttps = prependHttpsToURL(this.props.link);
        return (
            <div className="-ButtonRow">{
                this.props.linkType === "internal" ?
                <Link to={this.props.link}>{text}</Link> :
                <a href={urlHttps} target="_blank" rel="noreferrer noopener">{text}</a>
            }</div>
        );
    }
}