import React, { ReactNode } from "react";
import "./Admin.scss";
import LoginPanel from "./login-panel/LoginPanel";
import { Trans } from "react-i18next";
import { CredentialsEnum } from "./login-panel/CredentialsEnum";
import { Link } from "react-router-dom";
import EditUsersPanel from "./edit-users-panel/EditUsersPanel";
import PermsList from "./PermsList";
import WidthLimiter from "../../leaf-component/WidthLimiter/WidthLimiter";
import UsersManager from "../../../data-structures/user/UsersManager";

export type LoginFunc = (cred:{[x in CredentialsEnum]:string})=>Promise<void>;


export default class AdminPage extends React.Component<{login: {loggedIn: boolean, email?:string, error?: string, login:LoginFunc, signup:LoginFunc}, isAdmin: boolean, isEditor: boolean, usersManager:UsersManager}, {awaitingResponse?:boolean}> {
    constructor(props:AdminPage["props"]) {
        super(props);
        this.state = {};
    }

    /** Handle logging in and signing up. */
    onLogin = (isSignup:boolean,...args:Parameters<LoginFunc>):void => {
        const { login: { login, signup } } = this.props;
        let p;
        if (isSignup) p = signup(...args);
        else p = login(...args);
        this.setState({awaitingResponse:true});
        p.then(()=>this.setState({awaitingResponse:false}));
    };
    
    render():ReactNode {
        const { login: { loggedIn, error, email }, isAdmin, isEditor, usersManager } = this.props;
        return (
            <main className="AdminPage">
                <h1><Trans>page.admin.header</Trans></h1>
                {
                    loggedIn ? (
                        <>
                            <h3><Trans values={{email}}>page.admin.greeting</Trans></h3>
                            <WidthLimiter>
                                <Link to="/settings" className="-logout"><Trans>page.admin.logoutPrompt</Trans></Link>
                                <PermsList isAdmin={isAdmin} isEditor={isEditor} />
                            </WidthLimiter>
                            {isAdmin && <EditUsersPanel usersManager={usersManager}/>}
                        </>
                    ) : (
                        <LoginPanel loginError={error} login={this.onLogin} lockInput={this.state.awaitingResponse ?? false}/>
                    )
                }
            </main>
        );
    }
}