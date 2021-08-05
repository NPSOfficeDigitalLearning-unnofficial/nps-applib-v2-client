import React, { RefObject } from "react";
import { Trans } from "react-i18next";

export default class MultiSelectOption<T> extends React.Component<{selected:boolean,focused:boolean,name:string,value:{key:string,value:T},onChange:(sel:boolean)=>void},{},{}> {
    ref:RefObject<HTMLDivElement> = React.createRef();
    onClick = () => this.props.onChange(!this.props.selected);
    focus() { this.ref.current?.focus() }
    keyboardClick() { this.onClick() }
    render() {
        return (
            <div className={"-Option"+(this.props.selected?" -selected":"")+(this.props.focused?" -focused":"")} onClick={this.onClick}
                    role="option" aria-selected={this.props.focused} aria-checked={this.props.selected} tabIndex={-1} ref={this.ref}>
                <div className="-checkbox"/>
                <label><Trans>{this.props.name}</Trans></label>
            </div>
        );
    }
}