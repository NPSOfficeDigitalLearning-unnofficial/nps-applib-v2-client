import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import Application from "../../../../data-structures/app/Application";
import { GRADE_LEVELS, PLATFORMS, SUBJECTS } from "../../../../data-structures/app/application-enums";
import { prependHttpsToURL } from "../../../../util/link-util";
import StatusRow from "../../../appinfo/app-list/element/StatusRow";
import MultiEnumValues from "./MultiEnumValues";

export default class AppDataView extends React.Component<{app:Application}> {
    render():ReactNode {
        const { app } = this.props;
        return (
            <div className="-data">
                <div className="-center">
                    <h3 className="-app-name">{app.name}</h3>
                    <StatusRow type="approval" status={app.approval} />
                    <StatusRow type="privacy" status={app.privacy} />
                    <MultiEnumValues vals={app.platforms} transKey={"app.platforms"} possibleVals={PLATFORMS}/>
                    <MultiEnumValues vals={app.grades} transKey={"app.grades"} possibleVals={GRADE_LEVELS}/>
                    <MultiEnumValues vals={app.subjects} transKey={"app.subjects"} possibleVals={SUBJECTS}/>
                </div>
                {app.url && <a href={prependHttpsToURL(app.url)} target="_blank" rel="noopener noreferrer"><Trans>page.app.urlBlurb</Trans></a>}
                {app.embed && (<> 
                    <span className="-iframeBlurb"><Trans>page.app.iframeBlurb</Trans></span>
                    <iframe src={prependHttpsToURL(app.embed)} />
                </>)}
            </div>
        );
    }
}