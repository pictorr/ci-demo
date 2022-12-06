const databaseService = require('../../utils/databaseService/databaseService.js');
const utilityService = require('../../utils/utilityService.js');
const reportService = require('../../utils/reportService.js');
const moment = require('moment');

// download report
const downloadReport = (data, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getUsersByFieldNotFancy({language: language}, {}, null, language)
            .then(users => {
                let parsedData = generateReportQuery(data);
                let excelName = `${ moment(parsedData.queryIntervalStart).month() + 1 }-${ moment(parsedData.queryIntervalStart).year() }_`;
                excelName += `${ moment(parsedData.queryIntervalEnd).month() + 1 }-${ moment(parsedData.queryIntervalEnd).year() }_`;
                let query = {
                    createdOn: {
                        $gte: parsedData.queryIntervalStart,
                        $lte: parsedData.queryIntervalEnd
                    },
                    'session.0': {$exists: true},
                }
                return databaseService.getSessionsByFields(query, {}, {}, language)
                    .then(sessions => {
                        if (!sessions || sessions.length === 0) {
                            return reject(utilityService.parseCodeMessage('sessions_not_found_interval', language));
                        } else {
                            return (reportService.generateReportSessions(sessions, users, excelName, language))
                                .then(fileName => resolve(fileName))
                                .catch(err => reject(err))
                        }
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));

    });
}


const downloadReport1 = (data, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getUsersByFieldNotFancy({language: language}, {}, null, language)
            .then(users => {
                let parsedData = generateReportQuery(data);
                let excelName = `${ moment(parsedData.queryIntervalStart).month() + 1 }-${ moment(parsedData.queryIntervalStart).year() }_`;
                excelName += `${ moment(parsedData.queryIntervalEnd).month() + 1 }-${ moment(parsedData.queryIntervalEnd).year() }_`;
                let query = {
                    createdOn: {
                        $gte: parsedData.queryIntervalStart,
                        $lte: parsedData.queryIntervalEnd
                    },
                    'session.0': {$exists: true},
                }
                return databaseService.getSessionsByFields(query, {}, {}, language)
                    .then(sessions => {
                        if (!sessions || sessions.length === 0) {
                            return reject(utilityService.parseCodeMessage('sessions_not_found_interval', language));
                        } else {
                            return (reportService.generateReportSessions1(sessions, users, excelName, language))
                                .then(fileName => resolve(fileName))
                                .catch(err => reject(err))
                        }
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));

    });
}

const downloadReport2 = (data, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getUsersByFieldNotFancy({language: language}, {}, null, language)
            .then(users => {
                let parsedData = generateReportQuery(data);
                let excelName = `${ moment(parsedData.queryIntervalStart).month() + 1 }-${ moment(parsedData.queryIntervalStart).year() }_`;
                excelName += `${ moment(parsedData.queryIntervalEnd).month() + 1 }-${ moment(parsedData.queryIntervalEnd).year() }_`;
                let query = {
                    createdOn: {
                        $gte: parsedData.queryIntervalStart,
                        $lte: parsedData.queryIntervalEnd
                    },
                    'session.0': {$exists: true},
                }
                return databaseService.getSessionsByFields(query, {}, {}, language)
                    .then(sessions => {
                        if (!sessions || sessions.length === 0) {
                            return reject(utilityService.parseCodeMessage('sessions_not_found_interval', language));
                        } else {
                            return (reportService.generateReportSessions2(sessions, users, excelName, language))
                                .then(fileName => resolve(fileName))
                                .catch(err => reject(err))
                        }
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));

    });
}

const downloadReport3 = (data, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getUsersByFieldNotFancy({language: language}, {}, null, language)
            .then(users => {
                let parsedData = generateReportQuery(data);
                let excelName = `${ moment(parsedData.queryIntervalStart).month() + 1 }-${ moment(parsedData.queryIntervalStart).year() }_`;
                excelName += `${ moment(parsedData.queryIntervalEnd).month() + 1 }-${ moment(parsedData.queryIntervalEnd).year() }_`;
                let query = {
                    createdOn: {
                        $gte: parsedData.queryIntervalStart,
                        $lte: parsedData.queryIntervalEnd
                    },
                    'session.0': {$exists: true},
                }
                return databaseService.getSessionsByFields(query, {}, {}, language)
                    .then(sessions => {
                        if (!sessions || sessions.length === 0) {
                            return reject(utilityService.parseCodeMessage('sessions_not_found_interval', language));
                        } else {
                            return (reportService.generateReportSessions3(sessions, users, excelName, language))
                                .then(fileName => resolve(fileName))
                                .catch(err => reject(err))
                        }
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));

    });
}

// download users report
const downloadUsersReport = (language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getUsersByFieldNotFancy({language: language}, {}, null, language)
            .then(users => {
                return (reportService.generateUsersReport(users, language))
                    .then(fileName => resolve(fileName))
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));

    });
}

// helper function
// returns dateStart/dateEnd for DB query
const generateReportQuery = (data) => {
    let queryIntervalStart = moment({year: 2050, month: 0}).startOf('month').format();
    let queryIntervalEnd = moment({year: 2020, month: 0}).startOf('month').format();

    data.forEach((dataEl) => {
        if (dataEl.month === '-') {
            const currentYear = moment().year();
            if (dataEl.year === currentYear) {
                const currentMonth = moment().month();
                let start = moment({
                    year: currentYear,
                    month: 0
                }).startOf('month').format();
                if (start < queryIntervalStart) {
                    queryIntervalStart = start;
                } 
                let end = moment({
                    year: currentYear,
                    month: currentMonth
                }).endOf('month').format();
                if (end > queryIntervalEnd) {
                    queryIntervalEnd = end;
                }
            } else {
                let start = moment({
                    year: dataEl.year,
                    month: 0
                }).startOf('month').format();
                if (start < queryIntervalStart) {
                    queryIntervalStart = start;
                }
                let end = moment({
                    year: dataEl.year,
                    month: 11
                }).endOf('month').format();
                if (end > queryIntervalEnd) {
                    queryIntervalEnd = end;
                }
            }
        } else {
            let start = moment({
                year: dataEl.year,
                month: dataEl.month
            }).startOf('month').format();
            if (start < queryIntervalStart) {
                queryIntervalStart = start;
            }
            let end = moment({
                year: dataEl.year,
                month: dataEl.month
            }).endOf('month').format();
            if (end > queryIntervalEnd) {
                queryIntervalEnd = end;
            }
        }
    });

    let parsedData = {};
    parsedData.queryIntervalStart = queryIntervalStart;
    parsedData.queryIntervalEnd = queryIntervalEnd;

    return parsedData;
}

module.exports = {
    downloadReport,
    downloadReport1,
    downloadReport2,
    downloadReport3,
    downloadUsersReport
};