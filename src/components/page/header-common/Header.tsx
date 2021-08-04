import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import WidthLimiter from "../../leaf-component/WidthLimiter/WidthLimiter";
import "./Header.scss";

export default class HeaderCommon extends React.Component<{pageName:string}> {
    render():ReactNode {
        return (
            <div className="Header" role="heading">
                <WidthLimiter>
                    <div className="-left">
                        <div className="-appName"><Trans>thisApp.name</Trans></div>
                        <div className="-pageName"><code><Trans>{`page.${this.props.pageName}.name`}</Trans></code></div>
                    </div>
                    <div className="-right">
                        <Link to="/"><Trans>header.homeLink</Trans></Link>
                        <Link to="/about"><Trans>header.aboutLink</Trans></Link>
                        <Link to="/settings"><Trans>header.settingsLink</Trans></Link>
                    </div>
                </WidthLimiter>
            </div>
        );
    }
}