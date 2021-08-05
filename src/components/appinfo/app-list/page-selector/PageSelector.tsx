import React, { ChangeEvent, ReactNode } from "react";
import { JUMP_SIZE, NUM_PAGE_OPTIONS } from "./consts";
import PageButton, { HighlightMode } from "./PageButton";

import arrow1 from "./arrow/arrow-1.svg";
import arrow2 from "./arrow/arrow-2.svg";
import arrow3 from "./arrow/arrow-3.svg";
import { Trans, Translation } from "react-i18next";
import AppList, { APPS_PER_PAGE } from "../AppList";
import { FocusEvent } from "react";


export default class PageSelector extends React.Component<{page:number,numPages:number,onSwitch:(page:number)=>void,appsPerPage:number,onAppsPerPageChange:(n:number)=>void}> {
    onSelectPage = (page: number):void => this.props.onSwitch(page);
    onAppsPerPageChange = (e: ChangeEvent<HTMLInputElement>):void => {
        const {value} = e.target;
        if (value === "")
            return void this.props.onAppsPerPageChange(NaN);
        const {valueAsNumber} = e.target;
        if (isFinite(valueAsNumber))
            return void this.props.onAppsPerPageChange(valueAsNumber);
    };
    onAppsPerPageUnfocus = ():void => {
        const raw = this.props.appsPerPage;
        this.props.onAppsPerPageChange(AppList.cleanNumAppsPerPage(raw));
    };

    renderPageButton(page:number,highlight:HighlightMode,children:({type:"icon",data:string,reverse:boolean}|{type:"number"}),key?:number):ReactNode {
        return (<PageButton
            page={page}
            highlight={highlight}
            children={children}
            key={key}
            onClick={this.onSelectPage} />);
    }

    renderJumpButton(dist:number,highlight:HighlightMode):ReactNode {
        const { page, numPages } = this.props;
        return this.renderPageButton(
            Math.min(Math.max(page+dist,0),numPages-1),
            highlight,
            {
                type: "icon",
                data: ({"jump-small":arrow1,"jump-large":arrow2,"jump-ends":arrow3,"current":"","none":""})[highlight],
                reverse: (dist < 0)
            }
        );
    }
    
    render():ReactNode {
        const { page, numPages, appsPerPage } = this.props;
        const indecesOffset = Math.max(0,Math.min(numPages-NUM_PAGE_OPTIONS,page-Math.round(NUM_PAGE_OPTIONS/2)+1));
        const indeces = new Array(NUM_PAGE_OPTIONS).fill(null).map((_,i)=>i+indecesOffset).filter(v=>v>=0&&v<numPages);
        return (
            <div className="PageSelector">
                <div className="-pages">
                    {this.renderJumpButton(-Infinity,"jump-ends")}
                    {this.renderJumpButton(-JUMP_SIZE.LARGE,"jump-large")}
                    {this.renderJumpButton(-JUMP_SIZE.SMALL,"jump-small")}
                    {indeces.map(n=>this.renderPageButton(n,n===page?"current":"none",{"type":"number"},n))}
                    {this.renderJumpButton(JUMP_SIZE.SMALL,"jump-small")}
                    {this.renderJumpButton(JUMP_SIZE.LARGE,"jump-large")}
                    {this.renderJumpButton(Infinity,"jump-ends")}
                </div>
                <div className="-page-size">
                    <label><Trans>page.main.pageSelect.appsPerPageLabel</Trans></label>
                    <Translation>{t=>(
                        <input value={isNaN(appsPerPage)?"":appsPerPage}
                            onChange={this.onAppsPerPageChange}
                            onBlur={this.onAppsPerPageUnfocus}
                            type="number" min={APPS_PER_PAGE.min} max={APPS_PER_PAGE.max} 
                            aria-label={t("page.main.pageSelect.appsPerPageLabel")}/>
                    )}</Translation>
                </div>
            </div>
        );
    }
}
// <PageButton page={4} highlight="none" onClick={console.log}>{{type:"number"}}</PageButton>
