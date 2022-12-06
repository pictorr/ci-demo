const express = require('express');
const validatorService = require('../../utils/validatorService.js');
const utilityService = require('../../utils/utilityService.js');
const dinosaursFunctions = require('../functions/dinosaurs.js');
const router = express.Router();

//Controller for GET /dinosaurs
router.get('/', (req, res) => {
	return dinosaursFunctions.getDinosaurs(req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('dinosaurs_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});


const saveDinosaurUpload = utilityService.uploader.fields([
	{ name: 'image', maxCount: 1 },
]);

//Controller for POST /dinosaurs/dinosaur
router.post('/dinosaur', saveDinosaurUpload, (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.saveDinosaur, null, req.requestLanguage))
		.then(data => dinosaursFunctions.saveDinosaur(req, data, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('dinosaur_saved', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));

	/*
	If there was an array in the formData, you would have had to stringify it with JSON.stringify from frontend
	To correctly run the validator in this case, use this example:

	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema({
			...body,
			medicalInstitutes: JSON.parse(body.<your_array>)
		}, validatorService.schemas.saveDinosaur, null, req.requestLanguage))
	 */
});

//Controller for GET /dinosaurs/dinosaur/:dinosaurId
router.get('/dinosaur/:dinosaurId', saveDinosaurUpload, (req, res) => {
	return dinosaursFunctions.getDinosaur(req.params.dinosaurId, req.requestLanguage)
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('dinosaur_fetched', req.requestLanguage).message,
				data: data,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /dinosaurs/dinosaur
router.put('/dinosaur', saveDinosaurUpload, (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.updateDinosaur, null, req.requestLanguage))
		.then(data => dinosaursFunctions.updateDinosaur(req, data, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('dinosaur_updated', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for DELETE /dinosaurs/dinosaur/:dinosaurId
router.delete('/dinosaur/:dinosaurId', (req, res) => {
	return dinosaursFunctions.deleteDinosaur(req.params.dinosaurId, req.requestLanguage)
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('dinosaur_deleted', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

module.exports = router;