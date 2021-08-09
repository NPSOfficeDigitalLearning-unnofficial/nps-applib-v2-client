import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./404.scss";

export default class Error404Page extends React.Component {
    render():ReactNode {
        return (<>
            <main>TODO: 404 error page, <Link to="/">back to main</Link></main>
        </>);
    }
}