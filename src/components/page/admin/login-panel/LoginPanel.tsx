import React, { ReactNode } from "react";
import { Trans, Translation } from "react-i18next";
import WidthLimiter from "../../../leaf-component/WidthLimiter/WidthLimiter";
import { LoginFunc } from "../Admin";
import { CredentialsEnum } from "./CredentialsEnum";


export default class LoginPanel extends React.Component<{loginError?:string, lockInput:boolean, login:(isSignup:boolean,...args:Parameters<LoginFunc>)=>void}, {[x in CredentialsEnum]: string}> {
    constructor(props:LoginPanel["props"]) {
        super(props);
        this.state = {email:"",password:""};
    }

    onChange = (which:CredentialsEnum,e:React.ChangeEvent<HTMLInputElement>):void => {
        // Set state.username/password to the new value
        const newData:{[x in CredentialsEnum]?:string} = {
            [which]: e.target.value
        };
        this.setState(newData as Required<typeof newData>);
    };
    
    onSubmit = (signup:boolean,e:React.MouseEvent|React.KeyboardEvent):void => {
        if (!e.isTrusted) return;
        this.props.login(signup,this.state);
    };

    renderCredentialInput(which:CredentialsEnum):ReactNode {
        return (<Translation>{t=>(<input
            disabled={this.props.lockInput}
            value={this.state[which]}
            onChange={this.onChange.bind(this,which)}
            placeholder={t(`page.admin.login.${which}`)}
            type={which==="password"?"password":undefined}
            name={which}
            aria-label={t(`page.admin.login.${which}`)}
        />)}</Translation>);
    }
    renderSubmitButton(isSignup:boolean):ReactNode {
        return (<button
            disabled={this.props.lockInput}
            onClick={this.onSubmit.bind(this,isSignup)}>
            <Trans>{`page.admin.${isSignup?"signup":"login"}.submit`}</Trans>
        </button>);
    }

    render():ReactNode {
        return (
            <div className="-LoginPanel">
                <WidthLimiter>
                    {<p><Trans>page.admin.signup.infoBlurb</Trans></p>}
                    {this.props.loginError && <div className="-loginError"><Trans>{this.props.loginError}</Trans></div>}
                    {this.renderCredentialInput("email")}
                    {this.renderCredentialInput("password")}
                    {this.renderSubmitButton(false)}
                    {this.renderSubmitButton(true)}
                </WidthLimiter>
            </div>
        );
    }
}