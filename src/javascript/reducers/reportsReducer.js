import cloneDeep from 'lodash/cloneDeep';

export default function reportsReducer(state = cloneDeep(defaultState), action) {
    let newState = cloneDeep(state);
    switch (action.type) {
        case 'DOWNLOAD_REPORT': {
            newState.downloadingReport = true;
            newState.downloadingReportError = '';
            newState.reportFileName = '';
            return newState;
        }
        case 'DOWNLOAD_REPORT_FULFILLED': {
            newState.downloadingReport = false;
            newState.reportFileName = action.payload.fileName;
            return newState;
        }
        case 'DOWNLOAD_REPORT_REJECTED': {
            newState.downloadingReport = false;
            newState.downloadingReportError = action.payload.error;
            return newState;
        }
        case 'DOWNLOAD_USERS_REPORT': {
            newState.downloadingUsersReport = true;
            newState.downloadingUsersReportError = '';
            newState.reportUsersFileName = '';
            return newState;
        }
        case 'DOWNLOAD_USERS_REPORT_FULFILLED': {
            newState.downloadingUsersReport = false;
            newState.reportUsersFileName = action.payload.fileName;
            return newState;
        }
        case 'DOWNLOAD_USERS_REPORT_REJECTED': {
            newState.downloadingUsersReport = false;
            newState.downloadingUsersReportError = action.payload.error;
            return newState;
        }
        default:
            return newState;
    }
}

const defaultState = {
    downloadingReport: false,
    downloadingReportError: '',
    reportFileName: '',
    downloadingUsersReport: false,
    downloadingUsersReportError: '',
    reportUsersFileName: ''
};