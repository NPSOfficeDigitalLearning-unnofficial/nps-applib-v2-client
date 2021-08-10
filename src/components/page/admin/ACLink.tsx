import React, { ReactNode } from "react";
import { Trans } from "react-i18next";

export default class ACLink extends React.Component<{value?:string, valueExpired?: boolean, create:()=>void}> {
    mainDiv: React.RefObject<HTMLElement> = React.createRef();

    onInteract():void {
        const { value, valueExpired } = this.props;
        if (value && !valueExpired)
            this.copyValue();
        else
            this.props.create();
    }


    onClick = (e:React.MouseEvent):void => {
        this.onInteract();
    };
    onKeyPress = (e:React.KeyboardEvent):void => {
        const { key } = e;
        switch (key) {
        case "Enter":
        case " ":
            this.onInteract();
            break;
        }
    };
    onCopy = (e:React.ClipboardEvent):void => {
        e.preventDefault();
        const { value } = this.props;
        if (value !== undefined)
            e.clipboardData.setData("text/plain",value);
    };
    copyValue():void {
        this.mainDiv.current?.focus();
        document.execCommand("copy");
    }

    render():ReactNode {
        const { value, valueExpired } = this.props;
        return (
            <div className="-ACLink" onClick={this.onClick} onKeyPress={this.onKeyPress} onCopy={this.onCopy} tabIndex={0}><div>{
                value === undefined ? (
                    <>
                        <label><Trans>page.admin.acLink.create</Trans></label>
                        <p><Trans>page.admin.acLink.createDescription</Trans></p>
                    </>
                ) : !valueExpired ? (
                    <>
                        <label><Trans>page.admin.acLink.clickToCopy</Trans></label>
                        <p>{value}</p>
                    </>
                ) : (
                    <>
                        <label><Trans>page.admin.acLink.expired</Trans></label>
                    </>
                )
            }</div></div>
        );
    }
}