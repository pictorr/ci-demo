import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { getItemFromStorage } from "../../../utils/utils";
import Link from '@material-ui/core/Link';
import { connect } from 'react-redux';

class LoggedInMenu extends PureComponent {
    componentDidMount() {
        if (getItemFromStorage('isAdmin') === 'true') {
            this.setState({
                isAdmin: true
            });
        }
        if (getItemFromStorage('isMasterAdmin') === 'true') {
            this.setState({
                isMasterAdmin: true
            });
        }
    }

    state = {
        isAdmin: false,
        isMasterAdmin: false
    };

    render() {
        const { currentPage, onLogout, offerId, t } = this.props;
        const { isAdmin, isMasterAdmin } = this.state;
        const country = localStorage.getItem('country');

        return (
            <>
                {(isMasterAdmin) && country === 'ro' &&
                    <Link
                        className={`text-color-toolbar`}
                        href='/private/reports'
                        color="inherit">
                        {t('reports')}
                        <div className={` ${currentPage === 'reports' ? 'text-color-toolbar-1' : null}`} />
                    </Link>
                }
                {(isMasterAdmin || isAdmin) &&
                    <Link
                        className={`text-color-toolbar`}
                        href='/private/users'
                        color="inherit">
                        {t('manage_users')}
                        <div className={` ${currentPage === 'users' ? 'text-color-toolbar-1' : null}`} />

                    </Link>
                }
                {(isMasterAdmin) &&
                    <Link
                        className={`text-color-toolbar`}
                        href='/private/imports'
                        color="inherit">
                        {t('imports')}
                        <div className={` ${currentPage === 'imports' ? 'text-color-toolbar-1' : null}`} />

                    </Link>
                }
                <Link
                    className={`text-color-toolbar `}
                    href='/private/sessions'
                    color="inherit">
                    {t('my_sessions')}
                    <div className={` ${currentPage === 'sessions' ? 'text-color-toolbar-1' : null}`} />

                </Link>
                <Link
                    className={`text-color-toolbar `}
                    href={`/private/create-new-offer/${offerId}`}
                    color="inherit">
                    {t('new_offer')}
                    <div className={` ${currentPage === 'createOffer' ? 'text-color-toolbar-1' : null}`} />
                </Link>
                <Link
                    className={`text-color-toolbar`}
                    href='/private/account'
                    color="inherit">
                    {t('manage_account')}
                    <div className={` ${currentPage === 'account' ? 'text-color-toolbar-1' : null}`} />

                </Link>
                <Link
                    className={`text-color-toolbar`}
                    onClick={onLogout}
                    color="inherit">
                    {t('logout')}
                </Link>
            </>
        );
    }
}

const mapStateToProps = store => ( {
	offer: store.offer,
} );

export default withTranslation()(connect(mapStateToProps)(LoggedInMenu));