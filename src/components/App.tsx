import React from "react";
import { Route, Switch } from "react-router-dom";
import Application from "../data-structures/app/Application";
import "./App.scss";
import Error404Page from "./page/404/404";
import AboutPage from "./page/about/About";
import AdminPage from "./page/admin/Admin";
import HeaderCommon from "./page/header-common/Header";
import MainPage from "./page/main/Main";
import SettingsPage from "./page/settings/Settings";

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
            <Switch>
                <Route path="/" exact>
                    <HeaderCommon pageName="main" />
                    <MainPage apps={apps}/>
                </Route>
                <Route path="/settings">
                    <HeaderCommon pageName="settings" />
                    <SettingsPage admin={{loggedIn:false,logout:()=>console.log("TODO LOGOUT")}} />
                </Route>
                <Route path="/about">
                    <HeaderCommon pageName="about" />
                    <AboutPage />
                </Route>
                <Route path="/admin">
                    <HeaderCommon pageName="admin" />
                    <AdminPage />
                </Route>
                <Route>
                    <HeaderCommon pageName="404" />
                    <Error404Page />
                </Route>
            </Switch>
        </>);
    }
}
