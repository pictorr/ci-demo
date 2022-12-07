import { axios, createError, getItemFromStorage } from '../utils/utils';
import { calls } from '../utils/calls';

/**
 * Master Admin - Download Report
 */
export const downloadReport = (data, type) => {
    return dispatch => {
        dispatch({type: 'DOWNLOAD_REPORT'});
        if (type === 1) {
            axios(calls.downloadReport1(data, getItemFromStorage('token')))
                .then((res) => {
                    dispatch({
                        type: 'DOWNLOAD_REPORT_FULFILLED',
                        payload: {fileName: res.data}
                    });
                })
                .catch((err) => {
                    dispatch({
                        type: 'DOWNLOAD_REPORT_REJECTED',
                        payload: {error: createError(err)}
                    });
                });
        } else if (type === 2) {
            axios(calls.downloadReport2(data, getItemFromStorage('token')))
                .then((res) => {
                    dispatch({
                        type: 'DOWNLOAD_REPORT_FULFILLED',
                        payload: {fileName: res.data}
                    });
                })
                .catch((err) => {
                    dispatch({
                        type: 'DOWNLOAD_REPORT_REJECTED',
                        payload: {error: createError(err)}
                    });
                });
        } else if (type === 3) {
            axios(calls.downloadReport3(data, getItemFromStorage('token')))
                .then((res) => {
                    dispatch({
                        type: 'DOWNLOAD_REPORT_FULFILLED',
                        payload: {fileName: res.data}
                    });
                })
                .catch((err) => {
                    dispatch({
                        type: 'DOWNLOAD_REPORT_REJECTED',
                        payload: {error: createError(err)}
                    });
                });
        } else {
            axios(calls.downloadReport(data, getItemFromStorage('token')))
                .then((res) => {
                    dispatch({
                        type: 'DOWNLOAD_REPORT_FULFILLED',
                        payload: {fileName: res.data}
                    });
                })
                .catch((err) => {
                    dispatch({
                        type: 'DOWNLOAD_REPORT_REJECTED',
                        payload: {error: createError(err)}
                    });
                });
        }
    };
};

/**
 * Master Admin - Download Users
 */
export const downloadUsersReport = () => {
    return dispatch => {
        dispatch({type: 'DOWNLOAD_USERS_REPORT'});
        axios(calls.downloadUsersReport(getItemFromStorage('token')))
            .then((res) => {
                dispatch({
                    type: 'DOWNLOAD_USERS_REPORT_FULFILLED',
                    payload: {fileName: res.data}
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'DOWNLOAD_USERS_REPORT_REJECTED',
                    payload: {error: createError(err)}
                });
            });
    };
};