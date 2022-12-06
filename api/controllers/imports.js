const express = require('express');
const fs = require('fs');
const validatorService = require('../../utils/validatorService.js');
const utilityService = require('../../utils/utilityService.js');
const router = express.Router();
const importsFunctions = require('../functions/imports.js');

const fileUpload = utilityService.uploader.fields([
	{ name: 'file', maxCount: 1 },
]);

//Controller for GET /imports/get-info-systems
router.get('/get-info-systems', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.getSystemsInfo(req, req.requestLanguage))
        .then((data) => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: 'Done!',
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /imports/sisteme
router.post('/sisteme', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.sendSystemsData(req, req.requestLanguage))
        .then(() => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: 'Done!',
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /imports/ceiling
router.post('/ceiling', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.sendCeiling(req, req.requestLanguage))
        .then(() => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: 'Done!',
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /imports/special-walls
router.post('/special-walls', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.sendSpecialWalls(req, req.requestLanguage))
        .then(() => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: 'Done!',
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

// Controller for GET /imports/imported-special-walls
router.get('/imported-special-walls', (req, res) => {
    return importsFunctions.getImportedSpecialWalls(req.query.systemName, req.query.structureLink, req.requestLanguage)
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('imported_plates_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

// Controller for GET /imports/thicknesses
router.get('/thicknesses', (req, res) => {
    return importsFunctions.getThicknesses(req.query.systemName, req.query.height, req.query.structureLink, req.requestLanguage)
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('thicknesses_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

// Controller for GET /imports/sound-insulation
router.get('/sound-insulation', (req, res) => {
    return importsFunctions.getSoundInsulationValues(req.query.systemName, req.query.height, req.query.structureLink, req.requestLanguage)
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('thicknesses_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});


//Controller for POST /imports/plating-systems
router.post('/plating-systems', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.sendPlatingSystemsData(req, req.requestLanguage))
        .then(() => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: 'Done!',
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /imports/noisy-plating-systems
router.post('/noisy-plating-systems', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.sendNoisyPlatingSystemsData(req, req.requestLanguage))
        .then(() => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: 'Done!',
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});


//Controller for POST /imports/imported-systems-noisy-plating
router.get('/imported-systems-noisy-plating', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.getImportedNoisyPlatingSystems(req.query.systemName, req.requestLanguage))
        .then((data) => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: 'Done!',
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /imports/consumuri
router.get('/consumuri', (req, res) => {
    return importsFunctions.getImportedConsumptions(req.query.systemName, req.decoded.country || 'ro')
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('consumptions_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /imports/consumuri
router.post('/consumuri', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.sendConsumptionsData(req, req.decoded.country || 'ro'))
        .then(() => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: 'Done!',
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /imports/products
router.get('/products', (req, res) => {
    return importsFunctions.getProducts(req.decoded.country || 'ro')
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('products_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /imports/add-products
router.post('/add-products', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.importProducts(req, req.decoded.country || 'ro'))
        .then(() => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('products_imported', req.requestLanguage).message,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /imports/get-placi-permise
router.get('/get-placi-permise', (req, res) => {
    return importsFunctions.getAllowedPlates(req.requestLanguage)
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('allowed_plates_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /imports/get-uploads
router.get('/get-uploads', (req, res) => {
    return importsFunctions.getUploads(req.requestLanguage)
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('allowed_plates_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /imports/placi-permise
router.post('/placi-permise', fileUpload, (req, res) => {
    return validatorService.validateInput.hasBody(req)
        .then(() => importsFunctions.sendAllowedPlatesData(req, req.requestLanguage))
        .then(() => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('allowed_plates_fetched', req.requestLanguage).message,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /imports/imported-systems
router.get('/imported-systems', (req, res) => {
    return importsFunctions.getImportedPlates(req.query.systemName, req.requestLanguage)
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('imported_plates_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});


//Controller for GET /imports/imported-systems-plating
router.get('/imported-systems-plating', (req, res) => {
    return importsFunctions.getImportedPlatingPlates(req.query.systemName, req.requestLanguage)
        .then(data => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('imported_plates_fetched', req.requestLanguage).message,
                data: data,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

module.exports = router;
