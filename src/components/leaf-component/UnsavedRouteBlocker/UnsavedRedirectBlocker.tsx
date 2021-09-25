import React, { ReactNode } from "react";

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

    render():ReactNode { return <></> }
}