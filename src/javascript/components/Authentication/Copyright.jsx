import React, { PureComponent } from 'react';
import { Box, Link, Typography } from '@material-ui/core';
import { mainSite } from '../../utils/config.js';
import moment from 'moment';

export default class Copyright extends PureComponent {
    render() {
        const { t } = this.props;

        return (
            <Box mt={ 0 }>
                <Typography variant="body2" align="center">
                    { t('copyright') }
                    { ' @ ' }
                    <Link href={ mainSite } color="inherit" className="primaryColorText">
                        { t('copyright_value') }
                    </Link>
                    { ' ' }
                    { moment().format('YYYY') }
                </Typography>
            </Box>
        );
    }
}
