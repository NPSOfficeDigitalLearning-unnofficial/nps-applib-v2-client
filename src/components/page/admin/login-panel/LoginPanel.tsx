import React, { ReactNode } from "react";
import { Trans, Translation } from "react-i18next";
import WidthLimiter from "../../../leaf-component/WidthLimiter/WidthLimiter";
import { CredentialsEnum } from "./CredentialsEnum";
import "./LoginPanel.scss";


export default class LoginPanel extends React.Component<{loginError?:string, isSignup:boolean, login:(cred:{[x in CredentialsEnum]:string})=>void}, {[x in CredentialsEnum]: string}> {
    constructor(props:LoginPanel["props"]) {
        super(props);
        this.state = {username:"",password:""};
    }

    onChange = (which:CredentialsEnum,e:React.ChangeEvent<HTMLInputElement>):void => {
        // Set state.username/password to the new value
        const newData:{[x in CredentialsEnum]?:string} = {
            [which]: e.target.value
        };
        this.setState(newData as Required<typeof newData>);
    };
    
    onSubmit = (e:React.MouseEvent|React.KeyboardEvent):void => {
        if (!e.isTrusted) return;
        this.props.login(this.state);
    };

    renderCredentialInput(which:CredentialsEnum):ReactNode {
        return (<Translation>{t=>(<input
            value={this.state[which]}
            onChange={this.onChange.bind(this,which)}
            placeholder={t(`page.admin.login.${which}`)}
            type={which==="password"?"password":undefined}
            name={which}
            aria-label={t(`page.admin.login.${which}`)}
        />)}</Translation>);
    }

    render():ReactNode {
        return (
            <div className="-LoginPanel">
                <WidthLimiter>
                    {this.props.isSignup && <p><Trans>page.admin.signup.infoBlurb</Trans></p>}
                    {this.props.loginError && <div className="-loginError"><Trans>{this.props.loginError}</Trans></div>}
                    {this.renderCredentialInput("username")}
                    {this.renderCredentialInput("password")}
                    <button onClick={this.onSubmit} onKeyPress={this.onSubmit}><Trans>{`page.admin.${this.props.isSignup?"signup":"login"}.submit`}</Trans></button>
                </WidthLimiter>
            </div>
        );
    }
}