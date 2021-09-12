import React, { ReactNode } from "react";
import { Route, Switch } from "react-router-dom";
import ApplicationsManager from "../data-structures/app/ApplicationsManager";
import SessionManager from "../data-structures/session/SessionManager";
import { AsyncVoid } from "../util/ts-util";
import "./App.scss";
import ErrorDisplay, { ErrorData } from "./error-display/ErrorDisplay";
import Error404Page from "./page/404/404";
import AboutPage from "./page/about/About";
import AdminPage, { LoginFunc } from "./page/admin/Admin";
import HeaderCommon from "./page/header-common/Header";
import MainPage from "./page/main/Main";
import SettingsPage from "./page/settings/Settings";


export default class App extends React.Component<{sessionManager:SessionManager,appsManager:ApplicationsManager}> {
    readonly errDisplayRef = React.createRef<ErrorDisplay>();

    onLogin:LoginFunc = async(cred)=>{
        const { sessionManager } = this.props;
        const { email, password } = cred;
        try {
            this.showErrorIfExists(await sessionManager.login(email, password));
        } catch (e) {
            console.error(e);
            this.showRawError(e);
        }
    };
    onLogout:AsyncVoid = async()=>{
        const { sessionManager } = this.props;
        try {
            this.showErrorIfExists(await sessionManager.logout());
        } catch (e) {
            console.error(e);
            this.showRawError(e);
        }
    };

    showRawError = (err:any) => this.showError({error:"general",detail:(err instanceof Error)?err.stack:err});
    showErrorIfExists = (errData?:ErrorData|void):void => errData && this.showError(errData);
    showError = (errData:ErrorData):void=>{
        const { error, detail } = errData;
        this.errDisplayRef.current?.showError(error,detail);
    };

    render():ReactNode {
        const { sessionManager, appsManager } = this.props;
        const loggedIn = sessionManager.currentSession !== null,
            isAdmin = sessionManager.currentSession?.isAdmin ?? false,
            isEditor = isAdmin || (sessionManager.currentSession?.isEditor ?? false);

        const apps = appsManager.allApps;

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Header = (props:{pageName:string}):JSX.Element => (
            <HeaderCommon pageName={props.pageName} isAdmin={isAdmin}/>
        );

        return (<>
            <ErrorDisplay ref={this.errDisplayRef} />
            <Switch>
                <Route path="/" exact>
                    <Header pageName="main" />
                    <MainPage apps={apps} canEdit={isEditor}/>
                </Route>
                <Route path="/settings">
                    <Header pageName="settings" />
                    <SettingsPage admin={{loggedIn,logout:this.onLogout}} />
                </Route>
                <Route path="/about">
                    <Header pageName="about" />
                    <AboutPage />
                </Route>
                <Route path="/admin">
                    <Header pageName="admin" />
                    <AdminPage login={{loggedIn,email:sessionManager.currentSession?.email,login:this.onLogin,signup:async()=>console.log("TODO")}} isAdmin={isAdmin} isEditor={isEditor}/>
                </Route>
                <Route>
                    <Header pageName="404" />
                    <Error404Page />
                </Route>
            </Switch>
        </>);
    }
}
