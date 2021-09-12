import React, { ReactNode } from "react";
import { Trans } from "react-i18next";

export default class PermsList extends React.Component<{isEditor:boolean,isAdmin:boolean}> {
    render():ReactNode {
        const { isAdmin, isEditor } = this.props;
        const list:string[] = [];
        
        if (isEditor) list.push("edit");
        if (isAdmin) list.push("admin");

        if (list.length === 0) list.push("askForVerification");

        return (<div className="-PermsList">
            <span><Trans>{"page.admin.permission.listTitle"}</Trans></span>
            <ul>
                {list.map(v=>(
                    <li key={v}><Trans>{`page.admin.permission.${v}`}</Trans></li>
                ))}
            </ul>
        </div>);
    }
}