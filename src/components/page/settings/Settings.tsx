import React, { ReactNode } from "react";
import { Trans, Translation } from "react-i18next";
import { Link, Redirect } from "react-router-dom";
import WidthLimiter from "../../leaf-component/WidthLimiter/WidthLimiter";
import "./Settings.scss";
import SettingsRow from "./SettingsRow";

// key also acts as label
interface Setting {
    key: string;
    elts: ({
        key: string
    } & ({
        type: "button",
        callback: ()=>void
    } | {
        type: "link",
        link: string
    } | {
        type: "input",
        currentValue?: string,
        defaultValue: string,
        inputType?: "password"
    }))[];
}


export default class SettingsPage extends React.Component<{admin:{loggedIn:boolean,logout:()=>void,changePass:(str:string)=>Promise<void|boolean>}},{redirectToAdminPage?:boolean,redirectToVerifyPage?:boolean,newPassIn:string}> {
    constructor(props:SettingsPage["props"]) {
        super(props);
        this.state = {newPassIn:""} ?? this.state;
    }

    get settingsRows():readonly Setting[] {
        const { admin } = this.props;
        return admin.loggedIn ? [
            {
                key: "adminAccount",
                elts: [
                    { type: "button", key: "logout", callback: admin.logout }
                ]
            }, {
                key: "adminPassword",
                elts:  [
                    { type: "input", key: "newPassIn", defaultValue: "", currentValue: this.state.newPassIn, inputType:"password" },
                    { type: "button", key: "changeBtn", callback: this.handleChangePassButton }
                ]
            }
        ] : [
            {
                key: "adminAccount",
                elts: [
                    { type: "link", key: "login", link: "/admin" }
                ]
            }
        ];
    }

    onSettingsInputChange = (row:string,elt:string,e:React.ChangeEvent<HTMLInputElement>) => {
        if (!e.isTrusted) return;
        
        const newValue = e.target.value;        
        switch (row) {
        case "adminPassword":
            this.setState({newPassIn:newValue});
            break;
        }
        
    };
    onSettingsButtonClick = (row:string,elt:string,e:React.MouseEvent<HTMLButtonElement>) => {
        if (!e.isTrusted) return;
        const rows = this.settingsRows;
        const eltE = rows.find(v=>v.key===row)?.elts.find(v=>v.key===elt);
        if (eltE?.type === "button")
            eltE.callback();
    };

    handleChangePassButton = async () => {
        if (await this.props.admin.changePass(this.state.newPassIn))
            this.setState({redirectToVerifyPage:true});
    };

    render():ReactNode {
        return (<Translation>{t=>(<>
            {this.state.redirectToAdminPage && <Redirect to="/admin"/>}
            {this.state.redirectToVerifyPage && <Redirect to="/verify-link"/>}
            <main className="SettingsPage">
                <h1><Trans>page.settings.name</Trans></h1>
                <WidthLimiter>
                    <div className="-rows">{
                        this.settingsRows.map(row=>(
                            <SettingsRow key={row.key} label={`page.settings.row.${row.key}.label`}>{
                                row.elts.map(elt=>{
                                    const label = t(`page.settings.row.${row.key}.${elt.key}`);
                                    return {
                                        "button": elt.type==="button" && (
                                            <button key={elt.key} onClick={this.onSettingsButtonClick.bind(this,row.key,elt.key)}>
                                                {label}</button>
                                        ),
                                        "input": elt.type==="input" && (
                                            <input key={elt.key}
                                                aria-label={label}
                                                onChange={this.onSettingsInputChange.bind(this,row.key,elt.key)}
                                                value={elt.currentValue ?? elt.defaultValue}
                                                type={elt.inputType}/>
                                        ),
                                        "link": elt.type==="link" && (
                                            <Link key={elt.key} to={elt.link}>
                                                {label}</Link>
                                        )
                                    }[elt.type];
                                })
                            }</SettingsRow>
                        ))
                    }</div>
                </WidthLimiter>
            </main>
        </>)}</Translation>);
    }
}