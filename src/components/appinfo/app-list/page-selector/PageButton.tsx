import React, { ReactNode } from "react";
import { Trans } from "react-i18next";

export type HighlightMode = "none"|"current"|"jump-small"|"jump-large"|"jump-ends";

export default class PageButton extends React.Component<{page:number,onClick:(page:number)=>void,highlight:HighlightMode,children:{type:"icon",data:string,reverse:boolean}|{type:"number"}}> {
    onClick = ():void => {
        this.props.onClick(this.props.page);
    };
    
    render():ReactNode {
        const child = this.props.children.type === "icon" ? (
            <div className={"-img"+(this.props.children.reverse?" -reverse":"")}>
                <img src={this.props.children.data} />
            </div>
        ) : (
            <Trans values={{number:this.props.page}}>general.number</Trans>
        );

        return <div className={`-PageButton -${this.props.highlight}`} onClick={this.onClick}>{child}</div>;
    }
}