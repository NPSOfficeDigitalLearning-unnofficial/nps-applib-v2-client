import React, { ReactNode } from "react";
import { Route, Switch } from "react-router-dom";
import Application from "../data-structures/app/Application";
import ApplicationsManager from "../data-structures/app/ApplicationsManager";
import SessionManager, { SessionChangeHandler } from "../data-structures/session/SessionManager";
import UsersManager from "../data-structures/user/UsersManager";
import { AsyncVoid } from "../util/ts-util";
import "./App.scss";
import ErrorDisplay, { ErrorData } from "./error-display/ErrorDisplay";
import Error404Page from "./page/404/404";
import AboutPage from "./page/about/About";
import AdminPage, { LoginFunc } from "./page/admin/Admin";
import AppCreatePage from "./page/app-focus/AppCreatePage";
import AppFocusPage from "./page/app-focus/AppFocusPage";
import HeaderCommon from "./page/header-common/Header";
import MainPage from "./page/main/Main";
import SettingsPage from "./page/settings/Settings";


export default class App extends React.Component<{sessionManager:SessionManager,appsManager:ApplicationsManager,usersManager:UsersManager}> {
    readonly errDisplayRef = React.createRef<ErrorDisplay>();

    constructor(props:App["props"]) {
        super(props);
        props.sessionManager.addChangeHandler(this.onSessionChange);
    }

    private _mounted:boolean = false;
    componentDidMount() { this._mounted = true }
    componentWillUnmount() { this._mounted = false }
    onSessionChange:SessionChangeHandler = (manager,sess)=>{
        if (this._mounted)
            this.forceUpdate();
        console.log("LOGGED IN AS:",sess?.id);
    };

    onLogin:LoginFunc = async(cred)=>this.onLoginSignup("login",cred);
    onSignup:LoginFunc = async(cred)=>this.onLoginSignup("signup",cred);
    async onLoginSignup(which:"login"|"signup",cred:Parameters<LoginFunc>[0]):Promise<void> {
        const { sessionManager } = this.props;
        const { email, password } = cred;
        try {
            this.showErrorIfExists(await sessionManager[which](email, password));
        } catch (e) {
            console.error(e);
            this.showRawError(e);
        }
    }
    onLogout:AsyncVoid = async()=>{
        const { sessionManager } = this.props;
        try {
            this.showErrorIfExists(await sessionManager.logout());
        } catch (e) {
            console.error(e);
            this.showRawError(e);
        }
    };

    doCreateApp = async():Promise<Application>=>{
        // TODO real implementation of createApp
        await new Promise<void>(r=>setTimeout(r,2000));
        return new Application();
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
                <Route path="/new-app" exact>
                    <Header pageName="app" />
                    <AppCreatePage createApp={this.doCreateApp}/>
                </Route>
                <Route path="/app/:id" exact>
                    <Header pageName="app" />
                    <AppFocusPage apps={apps} onEdit={()=>console.log("TODO onEdit")} onDelete={()=>console.log("TODO onDelete")}/>
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
                    <AdminPage login={{loggedIn,email:sessionManager.currentSession?.email,login:this.onLogin,signup:this.onSignup}} isAdmin={isAdmin} isEditor={isEditor} usersManager={this.props.usersManager}/>
                </Route>
                <Route>
                    <Header pageName="404" />
                    <Error404Page />
                </Route>
            </Switch>
        </>);
    }
}
