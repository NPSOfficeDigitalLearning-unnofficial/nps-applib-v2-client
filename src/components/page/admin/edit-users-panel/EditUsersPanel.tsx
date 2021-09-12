import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import Session from "../../../../data-structures/session/Session";
import EditUserRow from "./EditUserRow";

const users:Session[] = [
    new Session({id:"1",email:"ay@bnr.com",isAdmin:false,isEditor:true}),
    new Session({id:"2",email:"t@bryh.com",isAdmin:false,isEditor:true}),
    new Session({id:"3",email:"tre@bryh.com",isAdmin:true,isEditor:false}),
    new Session({id:"4",email:"ahtr@bryj.com",isAdmin:true,isEditor:true}),
    new Session({id:"5",email:"awr@etb.com",isAdmin:false,isEditor:false}),
    new Session({id:"6",email:"aeb@yjb.com",isAdmin:false,isEditor:true})
];

export default class EditUsersPanel extends React.Component {

    onRowChange(id:string):void {
        console.log("TODO change",id);
        this.forceUpdate();
    }

    render():ReactNode {
        return (<>
            <h3><Trans>page.admin.userEditor.title</Trans></h3>
            <div className="-EditUsersPanel">
                {users.map(v=>(
                    <EditUserRow key={v.id} user={v} onChange={this.onRowChange.bind(this,v.id)}/>
                ))}
            </div>
        </>);
    }
}