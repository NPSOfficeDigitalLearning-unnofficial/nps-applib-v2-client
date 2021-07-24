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
    get numAppPages():number { return Math.floor(this.props.apps.length / NUM_APPS_PER_PAGE)+1 }
    get page():number { return this.state.pageN }

    setPage = (pageN:number):void => this.setState({pageN});

    render():ReactNode {
        return (
            <div className="AppList">
                <AppPage apps={this.showingApps} />
                <PageSelector numPages={this.numAppPages} onSwitch={this.setPage} page={this.page}/>
            </div>
        );
    }
}