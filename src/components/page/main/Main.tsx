import React, { ReactNode } from "react";
import Application from "../../../data-structures/app/Application";
import { ApprovalStatusEnum, APPROVAL_STATUSES, GradeLevelEnum, GRADE_LEVELS, PlatformEnum, PLATFORMS, PrivacyStatusEnum, PRIVACY_STATUSES, SubjectEnum, SUBJECTS } from "../../../data-structures/app/application-enums";
import { castSetEltsToEnum } from "../../../util/array-util";
import AppList from "../../appinfo/app-list/AppList";
import WidthLimiter from "../../leaf-component/WidthLimiter/WidthLimiter";
import "./Main.scss";
import SearchBar from "./search-bar/SearchBar";

export type SearchParams = {
    name: string,
    approval: Set<ApprovalStatusEnum>,
    privacy: Set<PrivacyStatusEnum>,
    platforms: Set<PlatformEnum>,
    subjects: Set<SubjectEnum>,
    grades: Set<GradeLevelEnum>
};

export default class MainPage extends React.Component<{apps:Application[],canEdit:boolean},{searchOptions:SearchParams}> {
    constructor(props:MainPage["props"]) {
        super(props);
        this.state = {searchOptions:{name:"",approval:new Set(),privacy:new Set(),platforms:new Set(),subjects:new Set(),grades:new Set()}};
    }

    updateSearchOptions = (name:string,data:Set<any>|string):void => {
        if (typeof(data)==="string") {
            if (!(name === "name"))
                throw new Error("should not happen");

            this.state.searchOptions[name] = data;
        } else {
            const nameToEnumMap = {
                "approval": APPROVAL_STATUSES,
                "privacy": PRIVACY_STATUSES,
                "platforms": PLATFORMS,
                "subjects": SUBJECTS,
                "grades": GRADE_LEVELS
            };
            if (!(name === "approval" || name === "privacy" || name === "platforms" || name === "subjects" || name === "grades"))
                throw new Error("should not happen");
            
            // @ts-ignore  The code works, but the ts linter does not check for indexing by name on the whole line but per expression, causing issues.
            this.state.searchOptions[name] = castSetEltsToEnum(nameToEnumMap[name],data);    
        }
        this.forceUpdate();
    };

    filterEnum<Enum>(arr:Application[],getAppData:(app:Application)=>Set<Enum>,searchingElements:Set<Enum>,needsEvery:boolean):void {
        if (searchingElements.size === 0) return;
        const newData = arr.filter(app=>{
            const data = getAppData(app);
            if (needsEvery)
                return [...searchingElements].every(v=>data.has(v));
            else
                return [...searchingElements].some(v=>data.has(v));
        });
        arr.splice(0, Infinity, ...newData);
    }
    get filteredApps():Application[] {
        const { apps } = this.props, { searchOptions: query } = this.state;
        apps.sort((a,b)=>a.name===b.name?0:a.name>b.name?1:-1);
        let filteredArr = [...apps];
        if (query.name.length > 0) filteredArr = filteredArr.filter(v=>v.name.includes(query.name));
        this.filterEnum(filteredArr,a=>new Set([a.approval]),query.approval,false);
        this.filterEnum(filteredArr,a=>new Set([a.privacy]),query.privacy,false);
        this.filterEnum(filteredArr,a=>a.platforms,query.platforms,true);
        this.filterEnum(filteredArr,a=>a.grades,query.grades,true);
        this.filterEnum(filteredArr,a=>a.subjects,query.subjects,true);
        return filteredArr;
    }

    render():ReactNode {
        const { searchOptions } = this.state;
        return (
            <main className="MainPage">
                <div className="-center">
                    <SearchBar searchParams={searchOptions}
                        onEnumTermChange={this.updateSearchOptions} onStringTermChange={this.updateSearchOptions} />
                </div>
                <WidthLimiter>
                    <AppList apps={this.filteredApps} canEdit={this.props.canEdit}/>
                </WidthLimiter>
            </main>
        );
    }
}