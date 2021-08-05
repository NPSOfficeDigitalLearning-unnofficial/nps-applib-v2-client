import React, { ReactNode } from "react";
import { Trans, Translation } from "react-i18next";

export type HighlightMode = "none"|"current"|"jump-small"|"jump-large"|"jump-ends";

export default class PageButton extends React.Component<{page:number,onClick:(page:number)=>void,highlight:HighlightMode,children:{type:"icon",data:string,reverse:boolean}|{type:"number"}}> {
    onClick = ():void => this.props.onClick(this.props.page);
    
    render():ReactNode {
        const {children: childData, page, highlight} = this.props;
        const pageTextNum = page+1;

        let ariaLabelKey:string;
        if (childData.type === "icon")
            ariaLabelKey = `page.main.pageSelect.${highlight}.${childData.reverse?"back":"fwd"}`;
        else ariaLabelKey = `page.main.pageSelect.${highlight==="current"?"current":"pageNButton"}`;
        
        const child = childData.type === "icon" ? (
            <div
                className={"-img"+(childData.reverse?" -reverse":"")}
                style={{
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    WebkitMaskImage: `url(${childData.data})`,
                    maskImage: `url(${childData.data})`
                }} />
        ) : (
            <Trans values={{number:pageTextNum}}>general.number</Trans>
        );

        return (<Translation>{t=>(
            <div className={`-PageButton -${highlight}`}
                aria-label={t(ariaLabelKey,{replace:{pageN:pageTextNum}})}
                onClick={this.onClick}>
                    {child}
            </div>
        )}</Translation>);
    }
}