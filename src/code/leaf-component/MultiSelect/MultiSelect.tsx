import React from "react";
import { Trans } from "react-i18next";
import "./MultiSelect.scss";
import MultiSelectOption from "./Option";

const VD = 300;

export type OptionData<T> = {[key:string]:{name:string,value:T}};

export default class MultiSelect<T> extends React.Component<{text:string,options:OptionData<T>,value:OptionData<T>,onChange:(value:OptionData<T>)=>void},{open:boolean,visibleTimerId?:NodeJS.Timeout,visible:boolean},{}> {
    constructor(props: MultiSelect<T>["props"]) {
        super(props);
        this.state = {open:false,visible:false};
    }

    get valueKeys() { return Object.entries(this.props.value).map(([key,])=>key) }

    onOptionChange = (key:string, sel:boolean) => {
        if ((key in this.props.value) === sel) return;
        let newValue = {...this.props.value};
        if (sel) newValue[key] = this.props.options[key];
        else delete newValue[key];
        this.props.onChange(newValue);
    };
    setOpen(newOpen: boolean) {
        let open = this.state.open, visibleTimerId:NodeJS.Timeout|undefined = undefined;
        if (open === newOpen) return;
        if (this.state.visibleTimerId !== undefined)
            clearTimeout(this.state.visibleTimerId);
        if (newOpen) this.setState({visible:true});
        else visibleTimerId = setTimeout(()=>this.setState({visible:false}),VD);
        this.setState({open:!this.state.open,visibleTimerId});
    }
    onToggleOpen = () => { this.setOpen(!this.state.open) };
    onClose = () => { this.setOpen(false) };

    render() {
        return (
            <div className={"MultiSelect"+(this.state.open?" -open":"")} aria-label={this.props.text} tabIndex={0} onMouseLeave={this.onClose}>
                <div className="-content" onClick={this.onToggleOpen}>
                    <Trans>{this.props.text}</Trans>
                </div>
                { this.state.visible && <div className="-options-aligner"><div className="-hover-break-protector">
                    <div className="-options">
                        {Object.entries(this.props.options).map(([key,{name,value}])=>(
                            <MultiSelectOption
                                key={key}
                                value={{key,value}} name={name}
                                selected={key in this.props.value}
                                onChange={this.onOptionChange.bind(this,key)}/>
                        ))}
                    </div>
                </div></div>}
            </div>
        );
    }
}