import React from "react";
import { Trans } from "react-i18next";
import { Route } from "react-router-dom";
import Application from "../data-structures/app/Application";
import "./App.scss";
import AppList from "./appinfo/app-list/AppList";

const apps = [
    new Application({name:"yeetapp",url:"google.com"}),
    new Application({name:"thte"}),
    new Application({name:"thecat",approval:"APPROVED"}),
    new Application({name:"anotherOne",url:"https://youtube.com"}),
    new Application({name:"the yes"}),
    new Application({name:"stupid thing",url:"#",privacy:"NONCOMPLIANT"}),
    new Application({name:"newapp",id:"T0T41LY_AN-1D"}),
    new Application({name:"funny"})
];


export default class App extends React.Component {
    render() {
        return (<>
            <Route path="/yeet"><p>TEST LOL</p></Route>
            
            <p><Trans>test.entry1</Trans></p>
            <AppList apps={apps} />
        </>);
    }
}
