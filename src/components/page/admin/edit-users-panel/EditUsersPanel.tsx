import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import UsersManager, { UsersChangeHandler } from "../../../../data-structures/user/UsersManager";
import EditUserRow from "./EditUserRow";



export default class EditUsersPanel extends React.Component<{usersManager:UsersManager}> {

    constructor(props:EditUsersPanel["props"]) {
        super(props);
        props.usersManager.addChangeHandler(this.onUserdataChange);
        props.usersManager.fetchCurrent();
    }
    
    private _mounted:boolean = false;
    componentDidMount() { this._mounted = true }
    componentWillUnmount() { this._mounted = false }
    onUserdataChange:UsersChangeHandler = (manager,what,data)=>{
        if (this._mounted)
            this.forceUpdate();
    };

    onRowChange(id:string):void {
        this.props.usersManager.patchUser(id,s=>s.setPermission("editor",!s.isEditor));
    }

    render():ReactNode {
        return (<>
            <h3><Trans>page.admin.userEditor.title</Trans></h3>
            <div className="-EditUsersPanel">
                {this.props.usersManager.allUsers.map(v=>(
                    <EditUserRow key={v.id} user={v} onChange={this.onRowChange.bind(this,v.id)}/>
                ))}
            </div>
        </>);
    }
}