import React, { ReactNode } from "react";
import MultiSelect, { OptionData } from "../../../leaf-component/MultiSelect/MultiSelect";


export default class AppEditorEnum<T> extends React.Component<{name:string,options:readonly T[]}&({onlyOne:true,value:T,onChange:(value:T)=>void}|{onlyOne?:false,value:Set<T>,onChange:(value:T[])=>void})> {

    onChange = (v:OptionData<T>):void => {
        if (this.props.onlyOne) 
            this.props.onChange(Object.values(v)[0].value);
        else 
            this.props.onChange(Object.values(v).map(({value})=>value));
    };

    render():ReactNode {
        const { name, options, onlyOne } = this.props;
        return (
            <MultiSelect<T>
                text={`app.${name}.name`}
                onlyOne={onlyOne}
                ariaLabel={`app.${name}.name-long`}
                value={Object.fromEntries((this.props.onlyOne?[this.props.value]:[...this.props.value]).map(v=>[v,{name:`app.${name}.${v}`,value:v}]))}
                options={Object.fromEntries(options.map(v=>[v,{name:`app.${name}.${v}`,value:v}]))}
                onChange={this.onChange}/>
        );
    }
}