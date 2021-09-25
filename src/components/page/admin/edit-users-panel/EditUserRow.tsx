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
        const { isAdmin } = user,
            isEditor = user.isEditor || isAdmin,
            transKeySuffix = isAdmin ? "admin" : isEditor.toString();
        return (<Translation>{t=>(<div className="-row">
            <div className="-email">{user.email}</div>
            <button
                className={`-isEditor -is-${isEditor}`} onClick={this.toggleEditor} disabled={isAdmin}
                aria-label={t(`page.admin.userEditor.toggleButtonLabel.${transKeySuffix}`,{email:user.email})}>
                {t(`page.admin.userEditor.toggleButton.${transKeySuffix}`)}
            </button>
        </div>)}</Translation>);
    }
}