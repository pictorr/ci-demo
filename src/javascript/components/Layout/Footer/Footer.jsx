import React, { PureComponent } from 'react';
import { Link, Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { mainSite } from '../../../utils/config.js';
import moment from 'moment';

class Footer extends PureComponent {
    render() {
        const { t } = this.props;

        return (
            <footer className='footer'>
                <Typography
                    variant="subtitle2"
                    align="center"
                    gutterBottom>
                    { t('copyright') }
                    { ' @ ' }
                    <Link href={ mainSite } color="inherit" className="primaryColorText">
                        { t('copyright_value') }
                    </Link>
                </Typography>
                <Typography
                    variant="subtitle2"
                    align="center"
                    color="textSecondary"
                    component="div">
                    { ' ' }
                    { moment().format('YYYY') }
                </Typography>
            </footer>
        );
    }
}

export default withTranslation()(Footer);