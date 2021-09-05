import React, { ReactNode, RefObject } from "react";
import { Translation } from "react-i18next";
import "./ErrorDisplay.scss";
import XSvg from "./XSvg";

export type ErrorData = {error:string,detail?:string};

export default class ErrorDisplay extends React.Component<{},{isShown?:boolean,hideTimeout?:number,error?:string,detail?:string}> {
    hideBtnRef:RefObject<HTMLButtonElement> = React.createRef();
    constructor(props:ErrorDisplay["props"]) {
        super(props);
        this.state = {}; 
    }

    showError(error:string,detailIn?:string):void {
        const detail = detailIn ?? "";        
        this.setState({isShown:true,error,detail});
        this.hideBtnRef.current?.focus();
    }

    hide = ():void => {
        this.setState({isShown:false});
        this.setHideTimeout();
    };
    setHideTimeout() {
        this.clearHideTimeout();
        this.setState({
            hideTimeout: setTimeout(() => this.setState({ isShown: undefined }), 300) as unknown as number
        });
    }
    clearHideTimeout() {
        clearTimeout(this.state.hideTimeout);
    }

    render():ReactNode {
        const { isShown, error, detail } = this.state;
        return (<Translation>{t=>(
            <div className={`ErrorDisplay ${isShown===undefined?"":"-show-"+isShown}`}>
                <button className="-close" onClick={this.hide} ref={this.hideBtnRef} aria-label={t("error.popupBox.closeLabel")}><XSvg/></button>
                <h1>{t(`error.${error??"general"}`)}</h1>
                <p>{detail}</p>
            </div>
        )}</Translation>);
    }
}