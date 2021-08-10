import React, { ReactNode } from "react";
import Application from "../../../data-structures/app/Application";
import "./AppList.scss";
import AppPage from "./AppPage";
import PageSelector from "./page-selector/PageSelector";

export const APPS_PER_PAGE:{
    readonly default: 8,
    readonly min: 4,
    readonly max: 80
} = { default: 8, min: 4, max: 80 };

export default class AppList extends React.Component<{apps:Application[],canEdit:boolean},{pageN:number,appsPerPage:number}> {
    constructor(props:AppList["props"]) {
        super(props);
        this.state = { pageN: 0, appsPerPage: APPS_PER_PAGE.default };
    }


    get showingApps():Application[] {
        return this.props.apps.slice(
            this.page     * this.appsPerPage,
            (this.page+1) * this.appsPerPage
        );
    }
    static cleanNumAppsPerPage(n:number) {
        return isFinite(n) ?
            Math.max(Math.min(n,APPS_PER_PAGE.max),APPS_PER_PAGE.min) :
            APPS_PER_PAGE.default;
    }
    static numAppPagesFromProps(props:AppList["props"],state:AppList["state"]):number {
        return Math.max(1,
            Math.ceil(props.apps.length / AppList.cleanNumAppsPerPage(state.appsPerPage))
        );
    }
    get appsPerPage():number { return AppList.cleanNumAppsPerPage(this.rawAppsPerPage) }
    get rawAppsPerPage():number { return this.state.appsPerPage }
    get numAppPages():number { return AppList.numAppPagesFromProps(this.props,this.state) }
    get page():number { return this.state.pageN }

    setPage = (pageN:number):void => this.setState({pageN});
    setAppsPerPage = (appsPerPage:number):void => this.setState({appsPerPage});

    static getDerivedStateFromProps(props: AppList["props"], state: AppList["state"]): Partial<AppList["state"]> {
        // Ensure that when apps are added and removed from the list, that a page number that is empty is not stayed on.
        return { pageN: Math.min(state.pageN,AppList.numAppPagesFromProps(props,state)-1) };
    }

    render():ReactNode {
        return (
            <div className="AppList">
                <PageSelector
                    numPages={this.numAppPages} onSwitch={this.setPage} page={this.page}
                    appsPerPage={this.rawAppsPerPage} onAppsPerPageChange={this.setAppsPerPage}/>
                <AppPage apps={this.showingApps} canEdit={this.props.canEdit} />
            </div>
        );
    }
}