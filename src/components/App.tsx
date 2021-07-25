import React from "react";
import { Trans } from "react-i18next";
import { Route } from "react-router-dom";
import Application from "../data-structures/app/Application";
import "./App.scss";
import AppList from "./appinfo/app-list/AppList";

const apps = [
    new Application({name:"yeetapp",url:"google.com",approval:"PILOT",privacy:"INSTRUCTOR_ONLY"}),
    new Application({name:"thte",approval:"14_PARENTAL_CONSENT",privacy:"NO_INFO_COLLECTED"}),
    new Application({name:"thecat",approval:"APPROVED",privacy:"NONCOMPLIANT"}),
    new Application({name:"anotherOne",url:"https://youtube.com"}),
    new Application({name:"the yes"}),
    new Application({name:"stupid thing",url:"#",privacy:"NONCOMPLIANT"}),
    new Application({name:"newapp",id:"T0T41LY_AN-1D"}),
    new Application({name:"funny"}),
    new Application({name:"obnoxios app with stupidly long name"})
];


export default class App extends React.Component {
    render() {
        return (<>
            <AppList apps={apps} />
        </>);
    }
}
