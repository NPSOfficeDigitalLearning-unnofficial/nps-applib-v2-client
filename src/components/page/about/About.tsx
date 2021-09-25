import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import WidthLimiter from "../../leaf-component/WidthLimiter/WidthLimiter";
import "./About.scss";

export default class AboutPage extends React.Component {
    render():ReactNode {
        return (<main className="AboutPage">
            <WidthLimiter>
                <h1><Trans>page.about.name</Trans></h1>
                <p>
                    <Trans>page.about.paragraph1</Trans>
                </p>
                <p>
                    <Trans>page.about.paragraph2</Trans>
                    <a href="https://github.com/SciDev5/nps-applib-v2-cli">https://github.com/SciDev5/nps-applib-v2-cli</a>.
                </p>
                <p>
                    <Trans>page.about.paragraph3</Trans>
                </p>
            </WidthLimiter>
        </main>);
    }
}