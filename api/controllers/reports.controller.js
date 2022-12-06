const express = require('express');
const utilityService = require('../../utils/utilityService.js');
const reportFunctions = require('../functions/reports.function.js');
const router = express.Router();

//Controller for POST /reports/download-report
router.post('/download-report', (req, res) => {
    let data = req.body;
    return reportFunctions.downloadReport(data, req.decoded.country || 'ro')
        .then(fileName => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('offer_downloaded', req.requestLanguage).message,
                data: fileName,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /reports/download-report-1
router.post('/download-report-1', (req, res) => {
    let data = req.body;
    return reportFunctions.downloadReport1(data, req.decoded.country || 'ro')
        .then(fileName => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('offer_downloaded', req.requestLanguage).message,
                data: fileName,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /reports/download-report-2
router.post('/download-report-2', (req, res) => {
    let data = req.body;
    return reportFunctions.downloadReport2(data, req.decoded.country || 'ro')
        .then(fileName => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('offer_downloaded', req.requestLanguage).message,
                data: fileName,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /reports/download-report-3
router.post('/download-report-3', (req, res) => {
    let data = req.body;
    return reportFunctions.downloadReport3(data, req.decoded.country || 'ro')
        .then(fileName => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('offer_downloaded', req.requestLanguage).message,
                data: fileName,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /reports/download-users-report
router.post('/download-users-report', (req, res) => {
    return reportFunctions.downloadUsersReport(req.decoded.country || 'ro')
        .then(fileName => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('offer_downloaded', 'ro').message,
                data: fileName,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

module.exports = router;