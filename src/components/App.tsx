import React from "react";
import { Trans } from "react-i18next";
import "./App.scss";

export default class App extends React.Component {
    render() {
        return (<>
            <p>TEST LOL</p>
            <p><Trans>test.entry1</Trans></p>
        </>);
    }
}
