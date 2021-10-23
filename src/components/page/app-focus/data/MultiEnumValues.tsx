import React, { ReactNode } from "react";
import { Trans } from "react-i18next";

export default class MultiEnumValues<T extends string> extends React.Component<{vals:Set<T>,transKey:string,possibleVals:readonly T[]}> {
    render():ReactNode {
        const { vals, transKey } = this.props;
        return (
            <div className="-MultiEnumValues">
                <p><Trans>{transKey+".name"}</Trans></p>
                <ul>
                    {[...vals].map(v=>(
                        <li key={v}><Trans>{transKey+"."+v}</Trans></li>
                    ))}
                </ul>
            </div>
        );
    }
}