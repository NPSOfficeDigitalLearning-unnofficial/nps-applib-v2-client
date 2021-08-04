import React, { ReactNode } from "react";
import Application from "../../../data-structures/app/Application";
import "./AppList.scss";
import AppPage from "./AppPage";
import { NUM_APPS_PER_PAGE } from "./consts";
import PageSelector from "./page-selector/PageSelector";


export default class AppList extends React.Component<{apps:Application[]},{pageN:number}> {
    constructor(props:AppList["props"]) {
        super(props);
        this.state = { pageN: 0 };
    }

    get showingApps():Application[] {
        return this.props.apps.slice(
            this.page     * NUM_APPS_PER_PAGE,
            (this.page+1) * NUM_APPS_PER_PAGE
        );
    }
    static numAppPagesFromProps(props:AppList["props"]):number { return Math.floor(props.apps.length / NUM_APPS_PER_PAGE)+1 }
    get numAppPages():number { return AppList.numAppPagesFromProps(this.props) }
    get page():number { return this.state.pageN }

    setPage = (pageN:number):void => this.setState({pageN});

    static getDerivedStateFromProps(props: AppList["props"], state: AppList["state"]): Partial<AppList["state"]> {
        // Ensure that when apps are added and removed from the list, that a page number that is empty is not stayed on.
        return { pageN: Math.min(state.pageN,AppList.numAppPagesFromProps(props)-1) };
    }

    render():ReactNode {
        return (
            <div className="AppList">
                <PageSelector numPages={this.numAppPages} onSwitch={this.setPage} page={this.page}/>
                <AppPage apps={this.showingApps} />
            </div>
        );
    }
}