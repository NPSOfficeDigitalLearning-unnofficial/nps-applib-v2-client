import React, { ReactNode } from "react";
import { Route, Switch } from "react-router-dom";
import Application from "../data-structures/app/Application";
import "./App.scss";
import Error404Page from "./page/404/404";
import AboutPage from "./page/about/About";
import AdminPage, { AdminNewPage } from "./page/admin/Admin";
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

const adminLoggedIn = false; // TODO

export default class App extends React.Component {
    render():ReactNode {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Header = (props:{pageName:string}):JSX.Element => (
            <HeaderCommon pageName={props.pageName} isAdmin={adminLoggedIn}/>
        );
        return (<>
            <Switch>
                <Route path="/" exact>
                    <Header pageName="main" />
                    <MainPage apps={apps} canEdit={adminLoggedIn}/>
                </Route>
                <Route path="/settings">
                    <Header pageName="settings" />
                    <SettingsPage admin={{loggedIn:adminLoggedIn,logout:()=>console.log("TODO LOGOUT")}} />
                </Route>
                <Route path="/about">
                    <Header pageName="about" />
                    <AboutPage />
                </Route>
                <Route path="/admin">
                    <Header pageName="admin" />
                    <AdminPage login={{loggedIn:adminLoggedIn,isSignup:false,login:async()=>console.log("TODO LOGIN")}} adminToken={{create:async ()=>console.log("TODO CREATE ADMIN TOKEN")}}/>
                </Route>
                <Route path="/admin-new/:acToken">
                    <Header pageName="admin" />
                    <AdminNewPage signup={async(tok,cred)=>console.log("TODO SIGNUP",tok,cred)}/>
                </Route>
                <Route>
                    <Header pageName="404" />
                    <Error404Page />
                </Route>
            </Switch>
        </>);
    }
}
