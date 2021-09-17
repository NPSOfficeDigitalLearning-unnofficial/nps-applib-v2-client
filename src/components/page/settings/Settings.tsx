import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
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
        defaultValue: string
    }))[];
}


export default class SettingsPage extends React.Component<{admin:{loggedIn:boolean,logout:()=>void}},{redirectToAdminPage?:boolean}> {
    constructor(props:SettingsPage["props"]) {
        super(props);
        this.state = {} ?? this.state;
    }

    get settingsRows():readonly Setting[] {
        const { admin } = this.props;
        return [
            {
                key: "adminAccount",
                elts: [
                    admin.loggedIn ? 
                        { type: "button", key:  "logout", callback: admin.logout } :
                        { type: "link", key: "login", link: "/admin" }
                ]
            }
        ];
    }

    onSettingsInputChange = (row:string,elt:string,e:React.ChangeEvent<HTMLInputElement>) => {
        if (!e.isTrusted) return;
        /*
        const newValue = e.target.value;
        switch (row) {
        case "example":
            console.log(`New value of input "${elt}" in (example name) is "${newValue}"`);
            break;
        }
        */
    };
    onSettingsButtonClick = (row:string,elt:string,e:React.MouseEvent<HTMLButtonElement>) => {
        if (!e.isTrusted) return;
        const rows = this.settingsRows;
        const eltE = rows.find(v=>v.key===row)?.elts.find(v=>v.key===elt);
        if (eltE?.type === "button")
            eltE.callback();
    };

    render():ReactNode {
        return (<>
            {this.state.redirectToAdminPage && <Redirect to="/admin"/>}
            <main className="SettingsPage">
                <h1><Trans>page.settings.name</Trans></h1>
                <WidthLimiter>
                    <div className="-rows">{
                        this.settingsRows.map(row=>(
                            <SettingsRow key={row.key} label={`page.settings.row.${row.key}.label`}>{
                                row.elts.map(elt=>{
                                    const label = `page.settings.row.${row.key}.${elt.key}`;
                                    return {
                                        "button": elt.type==="button" && (
                                            <button key={elt.key} onClick={this.onSettingsButtonClick.bind(this,row.key,elt.key)}>
                                                <Trans>{label}</Trans></button>
                                        ),
                                        "input": elt.type==="input" && (
                                            <input key={elt.key}
                                                onChange={this.onSettingsInputChange.bind(this,row.key,elt.key)}
                                                value={elt.currentValue ?? elt.defaultValue}/>
                                        ),
                                        "link": elt.type==="link" && (
                                            <Link key={elt.key} to={elt.link}>
                                                <Trans>{label}</Trans></Link>
                                        )
                                    }[elt.type];
                                })
                            }</SettingsRow>
                        ))
                    }</div>
                </WidthLimiter>
            </main>
        </>);
    }
}