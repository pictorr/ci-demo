const express = require('express');
const validatorService = require('../../utils/validatorService.js');
const utilityService = require('../../utils/utilityService.js');
const offersFunctions = require('../functions/offers.js');
const router = express.Router();

//Controller for GET /offers/getOffers
router.get('/getOffers', (req, res) => {
	return offersFunctions.getOffers(req.query.savedOfferId, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offers_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/deleteOffers
router.post('/deleteOffers', (req, res) => {
	return offersFunctions.deletePreviousOffers(req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offers_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/offer
router.post('/offer', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.saveOffer, null, req.requestLanguage))
		.then(data => offersFunctions.saveOffer(data, req.decoded, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_saved', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/offer-plating
router.post('/offer-plating', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.savePlatingOffer, null, req.requestLanguage))
		.then(data => offersFunctions.savePlatingOffer(data, req.decoded, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_saved', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /offers/offer
router.put('/offer', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.updateOffer, null, req.requestLanguage))
		.then(data => offersFunctions.updateOffer(req.query.savedOfferId, data, req.decoded, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_updated', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /offers/savedOffers
router.get('/savedOffers', (req, res) => {
	return offersFunctions.getSavedOffers(req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offers_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/current-offer
router.post('/current-offer', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.saveCurrentOffer, null, req.requestLanguage))
		.then(data => offersFunctions.saveCurrentOffer(req, data, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('current_offer_saved', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /offers/get-current-offer
router.get('/get-current-offer', (req, res) => {
	return offersFunctions.getCurrentOffer(req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offers_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /offers/offer/:offerId
router.get('/offer/:offerId', (req, res) => {
	return offersFunctions.getOffer(req.params.offerId, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for DELETE /offers/offer/:offerId
router.delete('/offer/:offerId', (req, res) => {
	return offersFunctions.deleteOffer(req.params.offerId, req.requestLanguage)
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /offers/new-offer
router.get('/new-offer', (req, res) => {
	return offersFunctions.newOffer(req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('new_offer_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /offers/new-offer
router.put('/new-offer', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.updateSavedOffer, null, req.requestLanguage))
		.then(data => offersFunctions.updateSavedOffer(req.query.savedOfferId, data, req.decoded, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('saved_offer_updated', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /offers/new-offer-plating
router.get('/new-offer-plating', (req, res) => {
	return offersFunctions.newOffer(req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('new_offer_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /offers/new-offer-plating
router.put('/new-offer-plating', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.updateSavedPlatingOffer, null, req.requestLanguage))
		.then(data => offersFunctions.updateSavedPlatingOffer(req.query.savedOfferId, data, req.decoded, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('saved_offer_updated', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /offers/saved-offer
router.get('/saved-offer', (req, res) => {
	return offersFunctions.getSavedOffer(req.query.savedOfferId, req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for DELETE /offers/saved-offer
router.delete('/saved-offer', (req, res) => {
	return offersFunctions.deleteSavedOffer(req.query.savedOfferId, req.requestLanguage)
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('dinosaur_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for DELETE /offers/delete-draft-offers
router.delete('/delete-draft-offers', (req, res) => {
	return offersFunctions.deleteDraftOffers(req.decoded, req.requestLanguage)
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('dinosaur_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/download-offer/:sessionId/:offerId
router.post('/download-offer/:sessionId/:offerId', (req, res) => {
	return offersFunctions.downloadOffer(req.params.sessionId, req.params.offerId, req.decoded.language || 'ro', req.decoded.country || 'ro')
		.then(fileName => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_downloaded', req.requestLanguage).message,
				data: fileName,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/download-session/:sessionId
router.post('/download-session/:sessionId', (req, res) => {
		return offersFunctions.downloadSession(req.params.sessionId, req.decoded.language || 'ro', req.decoded.country || 'ro')
		.then(fileName => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_downloaded', req.requestLanguage).message,
				data: fileName,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/save-session
router.post('/save-session', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(data => offersFunctions.saveSession(req.decoded, req.requestLanguage))
		.then((data) => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_saved', req.requestLanguage).message,
				data:data
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /offers/update-data-session
router.put('/update-data-session', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(data => offersFunctions.updateSession(req.decoded, data, req.requestLanguage))
		.then((data) => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_saved', req.requestLanguage).message,
				data:data
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /offers/update-offers-session
router.put('/update-offers-session', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.updateSession, null, req.requestLanguage))
		.then(data => offersFunctions.updateOfferSession(req.decoded, data, req.query.sessionId, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_saved', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /offers/delete-session-offer
router.put('/delete-session-offer', (req, res) => {
	return offersFunctions.deleteSessionOffer(req.decoded, req.query.sessionId, req.query.offerId, req.requestLanguage)
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offer_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/delete-saved-offers
router.post('/delete-saved-offers', (req, res) => {
	return offersFunctions.deleteSavedOffers(req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offers_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/delete-session
router.post('/delete-session', (req, res) => {
	return offersFunctions.deleteSavedSession(req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offers_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /offers/sessions
router.get('/sessions', (req, res) => {
	return offersFunctions.getSessions(req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offers_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /offers/get-session
router.get('/get-session', (req, res) => {
	return offersFunctions.getSession(req.query.sessionId, req.decoded, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('offers_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for DELETE /offers/session
router.delete('/session', (req, res) => {
	return offersFunctions.deleteSession(req.query.sessionId, req.requestLanguage)
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('session_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /offers/system-code
router.post('/system-code', (req, res) => {
	return offersFunctions.getSystemCode(req.body, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('system_code_found', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err))
});

module.exports = router;