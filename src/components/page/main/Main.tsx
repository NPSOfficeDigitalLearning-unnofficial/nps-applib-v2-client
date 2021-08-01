import React, { ReactNode } from "react";
import Application from "../../../data-structures/app/Application";
import AppList from "../../appinfo/app-list/AppList";
import MultiSelect from "../../leaf-component/MultiSelect/MultiSelect";
import Header from "./header/Header";
import "./Main.scss";
import SearchBar from "./search-bar/SearchBar";

const apps = [
    new Application({name:"yeetapp",url:"google.com",approval:"PILOT",privacy:"INSTRUCTOR_ONLY"}),
    new Application({name:"thte",approval:"14_PARENTAL_CONSENT",privacy:"NO_INFO_COLLECTED"}),
    new Application({name:"thecat",approval:"APPROVED",privacy:"NONCOMPLIANT"}),
    new Application({name:"anotherOne",url:"https://youtube.com"}),
    new Application({name:"the yes"}),
    new Application({name:"stupid thing",url:"#",privacy:"NONCOMPLIANT"}),
    new Application({name:"newapp",id:"T0T41LY_AN-1D"}),
    new Application({name:"funny"}),
    new Application({name:"obnoxios app with stupidly long name"})
];

export default class MainPage extends React.Component<{},{}> {
    render():ReactNode {
        return (
            <div className="MainPage">
                <Header/>
                <SearchBar />
                <AppList apps={apps}/>
            </div>
        );
    }
}