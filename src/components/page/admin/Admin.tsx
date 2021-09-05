import React, { ReactNode } from "react";
import "./Admin.scss";
import ACLink from "./ACLink";
import LoginPanel from "./login-panel/LoginPanel";
import { Trans } from "react-i18next";
import { CredentialsEnum } from "./login-panel/CredentialsEnum";


// TODO, remake admin signup to reflect new system.

// eslint-disable-next-line @typescript-eslint/naming-convention
export function AdminNewPage(props:{signup:(cred:{[x in CredentialsEnum]:string})=>void,signupError?:string}):JSX.Element {
    return (
        <AdminPage
            login={{
                loggedIn: false,
                isSignup: true,
                error: props.signupError, 
                login: cred=>props.signup(cred)
            }}
            adminToken={{create:()=>{}}}/>
    );
}


export default class AdminPage extends React.Component<{login: {loggedIn: boolean, isSignup: boolean, error?: string, login:(cred:{[x in CredentialsEnum]:string})=>void}, adminToken:{url?: string, create:()=>void}}> {
    render():ReactNode {
        return (
            <main className="AdminPage">
                <h1><Trans>page.admin.header</Trans></h1>
                {
                    this.props.login.loggedIn ? (
                        <div>
                            <ACLink value={this.props.adminToken.url} create={this.props.adminToken.create} />
                        </div>
                    ) : (
                        <LoginPanel loginError={this.props.login.error} isSignup={this.props.login.isSignup} login={this.props.login.login}/>
                    )
                }
            </main>
        );
    }
}