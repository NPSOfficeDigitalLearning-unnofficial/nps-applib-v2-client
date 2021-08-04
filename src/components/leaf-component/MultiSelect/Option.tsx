import React from "react";
import { Trans } from "react-i18next";

export default class MultiSelectOption<T> extends React.Component<{selected:boolean,name:string,value:{key:string,value:T},onChange:(sel:boolean)=>void},{},{}> {
    onClick = () => this.props.onChange(!this.props.selected);
    render() {
        return (
            <div className={"-Option"+(this.props.selected?" -selected":"")} onClick={this.onClick}>
                <div className="-checkbox"/>
                <label><Trans>{this.props.name}</Trans></label>
            </div>
        );
    }
}