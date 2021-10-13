import React from "react";
import { Redirect } from "react-router";
import Application from "../../../data-structures/app/Application";

export default class ExportPage extends React.Component<{apps:Application[],canEdit:boolean}> {
    render() {
        const { canEdit } = this.props;

        // If the user attempting to access the page can't edit go back to the main page.
        if (!canEdit)
            return <Redirect to="/"/>;

        return "TODO make this exist";
    }
}