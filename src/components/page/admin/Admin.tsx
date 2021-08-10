import React, { ReactNode } from "react";
import "./Admin.scss";
import ACLink from "./ACLink";
import LoginPanel from "./login-panel/LoginPanel";
import { Trans } from "react-i18next";
import { CredentialsEnum } from "./login-panel/CredentialsEnum";
import { useParams } from "react-router-dom";



// eslint-disable-next-line @typescript-eslint/naming-convention
export function AdminNewPage(props:{signup:(token:string,cred:{[x in CredentialsEnum]:string})=>void,signupError?:string}):JSX.Element {
    const { acToken } = useParams() as { acToken: string };
    return (
        <AdminPage
            login={{
                loggedIn: false,
                isSignup: true,
                error: props.signupError, 
                login: cred=>props.signup(acToken,cred)
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