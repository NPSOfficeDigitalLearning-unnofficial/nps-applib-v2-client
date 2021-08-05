import React, { ReactNode } from "react";
import { Trans, Translation } from "react-i18next";
import { ApprovalStatusEnum, APPROVAL_STATUSES, GradeLevelEnum, GRADE_LEVELS, PlatformEnum, PLATFORMS, PrivacyStatusEnum, PRIVACY_STATUSES, SubjectEnum, SUBJECTS } from "../../../../data-structures/app/application-enums";
import MultiSelect, { OptionData } from "../../../leaf-component/MultiSelect/MultiSelect";
import { SearchParams } from "../Main";
import "./SearchBar.scss";
import SearchTerm from "./SearchTerm";

export default class SearchBar extends React.Component<{searchParams:SearchParams,onEnumTermChange:(name:string,data:Set<any>)=>void,onStringTermChange:(name:string,data:string)=>void}> {
    
    renderEnumSearchTerm<Enum>(enumArr:readonly Enum[],enumName:string,value:Set<Enum>):ReactNode {
        return (
            <SearchTerm<ApprovalStatusEnum> type="dropdown"
                text={`app.${enumName}.name`}
                description={`app.${enumName}.name-long`}
                onChange={this.onEnumTermChange.bind(this,enumArr,enumName)}
                value={Object.fromEntries([...value].map(v=>[v,{name:`app.${enumName}.${v}`,value:v}]))}
                options={Object.fromEntries(enumArr.map(v=>[v,{name:`app.${enumName}.${v}`,value:v}]))}
        />);
    }
    onEnumTermChange<Enum>(enumArr:readonly Enum[],enumName:string,data:OptionData<Enum>):void {
        const newValue:Set<Enum> = new Set();
        for (const {value} of Object.values(data))
            newValue.add(value);
        this.props.onEnumTermChange(enumName, newValue);
    }

    renderStringSearchTerm(name:string,value:string):ReactNode {
        return (
            <SearchTerm type="string"
                text={`app.${name}.name`}
                description={`app.${name}.name-long`}
                onChange={this.onStringTermChange.bind(this,name)}
                value={value}
        />);
    }
    onStringTermChange(name:string,data:string):void {
        this.props.onStringTermChange(name, data);
    }
    
    render():ReactNode {
        const { name, approval, privacy, platforms, grades, subjects } = this.props.searchParams;
        return (
            <Translation>{t=>(
                <div className="SearchBar" aria-label={t("page.main.searchbarTitle")} role="heading" aria-level={1}>
                    <div className="-title"><span>{t("page.main.searchbarTitle")}</span></div>
                    <div className="-entries">
                        {this.renderStringSearchTerm("name",name)}
                        {this.renderEnumSearchTerm<ApprovalStatusEnum>(APPROVAL_STATUSES,"approval",approval)}
                        {this.renderEnumSearchTerm<PrivacyStatusEnum>(PRIVACY_STATUSES,"privacy",privacy)}
                        {this.renderEnumSearchTerm<PlatformEnum>(PLATFORMS,"platforms",platforms)}
                        {this.renderEnumSearchTerm<SubjectEnum>(SUBJECTS,"subjects",subjects)}
                        {this.renderEnumSearchTerm<GradeLevelEnum>(GRADE_LEVELS,"grades",grades)}
                    </div>
                </div>
            )}</Translation>
        );
    }
}