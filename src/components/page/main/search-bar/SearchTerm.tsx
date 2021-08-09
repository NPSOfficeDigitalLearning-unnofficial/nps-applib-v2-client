import React, { ChangeEvent, ReactNode } from "react";
import { Translation } from "react-i18next";
import MultiSelect, { OptionData } from "../../../leaf-component/MultiSelect/MultiSelect";

export default class SearchTerm<OptionType=string> extends React.Component<{text:string,description:string}&({type:"string",value:string,onChange:(data:string)=>void}|{type:"dropdown",value:OptionData<OptionType>,options:OptionData<OptionType>,onChange:(data:OptionData<OptionType>)=>void})> {
    
    onChangeStr = (e:ChangeEvent<HTMLInputElement>) => {
        if (this.props.type === "string" && e.isTrusted)
            this.props.onChange(e.target.value);
    };
    onChangeDropdown = (value:OptionData<OptionType>) => {
        if (this.props.type === "dropdown")
            this.props.onChange(value);
    };
    
    render():ReactNode {
        let elt:ReactNode;
        if (this.props.type === "string") {
            elt = (
                <Translation>
                    {t => this.props.type === "string"?(
                        <input className="-string"
                            placeholder={t(this.props.text)}
                            aria-label={t(this.props.description)}
                            value={this.props.value}
                            onChange={this.onChangeStr} />):()=><></>}
                </Translation>);
        } else { 
            elt = (
                <MultiSelect<OptionType>
                    value={this.props.value}
                    text={this.props.text}
                    ariaLabel={this.props.description}
                    options={this.props.options}
                    onChange={this.onChangeDropdown}/>
            );
        }
        return (
            <div className="-SearchTerm">
                {elt}
            </div>
        );
    }
}