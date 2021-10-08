import React, { ReactNode } from "react";
import { Translation } from "react-i18next";
import { Prompt } from "react-router";

/** Shows the "are you sure you want to leave, there are unsaved changes" prompt. */
export default class UnsavedRedirectBlocker extends React.Component<{unsaved:boolean}> {
    componentDidMount() {
        window.addEventListener("beforeunload",this.onBeforeUnload);
    }
    componentWillUnmount() {
        window.removeEventListener("beforeunload",this.onBeforeUnload);
    }
    onBeforeUnload = (e:BeforeUnloadEvent) => {
        if (this.props.unsaved)
            return e.returnValue = true;
    };

    render():ReactNode {
        return (
            <Translation>{t=>(
                <Prompt message={t("page.app.unsavedRedirectMessage")} when={this.props.unsaved}/>
            )}</Translation>
        );
    }
}