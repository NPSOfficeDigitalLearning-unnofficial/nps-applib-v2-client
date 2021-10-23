import React, { ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function ERow(props:{children:ReactNode}):JSX.Element {
    return <div className="-r">{props.children}</div>;
}
