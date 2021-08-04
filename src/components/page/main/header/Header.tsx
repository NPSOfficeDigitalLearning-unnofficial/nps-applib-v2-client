import React, { ReactNode } from "react";
import HeaderCommon from "../../header-common/Header";
import "./Header.scss";

export default class Header extends React.Component {
    render():ReactNode {
        return <HeaderCommon pageName="main"/>;
    }
}