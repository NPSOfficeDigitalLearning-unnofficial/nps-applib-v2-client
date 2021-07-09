import React from "react";
import { Trans } from "react-i18next";

export default class Test extends React.Component {
    render() {
        return (<>
            <p>TEST LOL</p>
            <p><Trans>test.entry1</Trans></p>
        </>);
    }
}
