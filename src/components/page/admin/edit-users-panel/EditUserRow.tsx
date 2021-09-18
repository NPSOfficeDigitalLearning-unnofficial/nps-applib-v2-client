import React, { ReactNode } from "react";
import { Translation } from "react-i18next";
import Session from "../../../../data-structures/session/Session";

export default class EditUserRow extends React.Component<{user:Session,onChange:()=>void}> {
    toggleEditor = () => {
        const { onChange } = this.props;
        onChange();
    };
    render():ReactNode {
        const { user } = this.props;
        return (<Translation>{t=>(<div className="-row">
            <div className="-email">{user.email}</div>
            <button
                className={`-isEditor -is-${user.isEditor}`} onClick={this.toggleEditor} 
                aria-label={t(`page.admin.userEditor.toggleButtonLabel.${user.isEditor}`,{email:user.email})}>
                {t(`page.admin.userEditor.toggleButton.${user.isEditor}`)}
            </button>
        </div>)}</Translation>);
    }
}