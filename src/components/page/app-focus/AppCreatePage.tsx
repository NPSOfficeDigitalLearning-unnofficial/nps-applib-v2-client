import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Application from "../../../data-structures/app/Application";
import { Mutable } from "../../../util/ts-util";
import "./app-focus-common.scss";

export default class AppCreatePage extends React.Component<{createApp:()=>Promise<Application|null>},{app?:Application,failed?:boolean}> {
    constructor(props:AppCreatePage["props"]) {
        super(props);
        this.state = {};
    }

    /** Function which creates the new app. (called on mount because that happense once) */
    create() {
        this.props.createApp().then(app=>{
            // Create partial state depending on if the app was successfully created.
            const newState:Partial<Mutable<AppCreatePage["state"]>> = {};
            if (app) newState.app = app;
            else newState.failed = true;
            // Merge in the new state.
            this.setState(newState);
        });
    }

    /** If the component has mounted on the screen yet. */
    componentDidMount() { this.create() }

    render() {
        const {app,failed} = this.state;
        let contents:ReactNode;

        if (app) 
            contents = <Redirect to={`/app/${app.id}`}/>;
        else if (failed)
            contents = <><h1><Trans>page.app.createFailed</Trans></h1><Link to="/"><Trans>page.app.backToMain</Trans></Link></>;
        else 
            contents = <h1><Trans>page.app.isCreating</Trans></h1>;

        return <main className="AppCreatePage">{contents}</main>;
    }
}