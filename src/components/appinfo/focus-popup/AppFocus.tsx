import React, { ReactNode } from "react";
import Application from "../../../data-structures/app/Application";
import "./AppFocus.scss";

export default class AppFocus extends React.Component<{app:Application,onEdit:()=>void,onDelete:()=>void}> {
    render():ReactNode {
        return `app [#${this.props.app.id}]`;
    }
}