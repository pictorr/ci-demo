import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CustomButton from "../Templates/Buttons/CustomButton";
import { downloadUsersReport } from '../../actions/reportsActions';
import PublishIcon from '@material-ui/icons/Publish';

class DownloadUsers extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    componentDidUpdate(prevProps) {
        const { reports } = this.props;
        if (prevProps.reports.reportUsersFileName !== reports.reportUsersFileName && reports.reportUsersFileName.length > 0) {
            setTimeout(() => {
                window.open(`${process.env.REACT_APP_PUBLIC_UPLOADS}/${reports.reportUsersFileName}`);
            }, 500);
        }
        if (prevProps.reports.downloadingUsersReportError !== reports.downloadingUsersReportError && reports.downloadingUsersReportError.length > 0) {
            this.setState({
                error: reports.downloadingUsersReportError
            })
        }
    }

    _handleSubmit = () => {
        const { dispatch } = this.props;
        dispatch(downloadUsersReport());
    }

    render() {
        const { t } = this.props;
        return <CustomButton
            onClick={this._handleSubmit}
            title={t('download_users')}
            prefix={(<PublishIcon className="rotate-180deg mr-5" />)}
            className='pl-17 pr-20 white-space'
        />
    }
}

const mapStateToProps = store => ({
    reports: store.reports,
});

export default withTranslation()(connect(mapStateToProps)(DownloadUsers));