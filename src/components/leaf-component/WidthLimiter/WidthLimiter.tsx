import React, { ReactNode } from "react";
import "./WidthLimiter.scss";

export default class WidthLimiter extends React.Component<{children:ReactNode}> {
    render():ReactNode {
        return (
            <div className="WidthLimiter">
                <div className="-buffer" />
                <div className="-content">{this.props.children}</div>
                <div className="-buffer" />
            </div>
        );
    }
}