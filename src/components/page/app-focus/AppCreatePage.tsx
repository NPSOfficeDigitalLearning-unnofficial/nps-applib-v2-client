import React from "react";
import { Trans } from "react-i18next";
import { Redirect } from "react-router";
import Application from "../../../data-structures/app/Application";
import "./app-focus-common.scss";

export default class AppCreatePage extends React.Component<{createApp:()=>Promise<Application>},{app?:Application}> {
    constructor(props:AppCreatePage["props"]) {
        super(props);
        this.state = {};

        props.createApp().then(app=>{
            if (this.mounted)
                this.setState({app});
            else this.state = {app};
        });
    }

    private mounted = false;
    componentDidMount() { this.mounted = true }

    render() {
        const {app} = this.state;
        if (app) return <Redirect to={`/app/${app.id}`}/>;
        else return <h1 className="AppCreatePage"><Trans>page.app.isCreating</Trans></h1>;
    }
}