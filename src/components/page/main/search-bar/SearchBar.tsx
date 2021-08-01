import React, { ReactNode } from "react";
import MultiSelect, { OptionData } from "../../../leaf-component/MultiSelect/MultiSelect";
import "./SearchBar.scss";
import SearchTerm from "./SearchTerm";

export default class SearchBar extends React.Component<{}> {
    render():ReactNode {
        return (
            <div className="SearchBar">
                <div className="-entries">
                    <SearchTerm type="string" text="app.approval.UNK" onChange={console.log} value={""} />
                    <SearchTerm<number> type="dropdown" text="app.approval.APPROVED" onChange={console.log} value={{k:{name:"4",value:5}}} options={{"54h4":{name:"te",value:3}}}/>
                </div>
            </div>
        );
    }
}