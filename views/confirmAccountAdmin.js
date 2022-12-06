const utilityService = require('../utils/utilityService.js');
const mailingTemplates = require('../views/mailingTemplates.js');

const confirmAccountAdmin = (savedUser, language) => {
	sendEmail = () => {
		const { subject, html } = mailingTemplates.confirmAccount(savedUser, savedUser.language); 
		return utilityService.mailTo(req, savedUser.emailAddress, subject, html);
	}
	return ( {
        subjectAdmin: utilityService.parseCodeMessage('register_admin_subject', language).message,
        htmlAdmin:
            `
	<!DOCTYPE html>
	<html>
	
	<head>
	    <title>Confirm account</title>
	</head>
	<body>
		<div>
			${utilityService.parseCodeMessage('register_admin_body_1', language).message}	      
		</div>
		<br />
		<div>
			${utilityService.parseCodeMessage('first_name', language).message}: ${savedUser.firstName}      
		</div>
		<div>
			${utilityService.parseCodeMessage('last_name', language).message}: ${savedUser.lastName}      
		</div>
		<div>
			${utilityService.parseCodeMessage('phone_number', language).message}: ${savedUser.phoneNumber}      
		</div>
		<div>
			${utilityService.parseCodeMessage('email_address', language).message}: ${savedUser.emailAddress}      
		</div>
		<div>
			${utilityService.parseCodeMessage('company', language).message}: ${savedUser.company}      
		</div>
		<div>
			${utilityService.parseCodeMessage('job', language).message}: ${savedUser.job}      
		</div>
		<div>
			${utilityService.parseCodeMessage('address', language).message}: ${savedUser.address}      
		</div>
		<div>
			${utilityService.parseCodeMessage('locality', language).message}: ${savedUser.locality}      
		</div>
		<div>
			${utilityService.parseCodeMessage('state', language).message}: ${savedUser.state}      
		</div>
		<br />
		<div>
			${utilityService.parseCodeMessage('country', language).message}: ${savedUser.country.toUpperCase()}
		</div>
		<div>
			${utilityService.parseCodeMessage('language', language).message}: ${savedUser.language.toUpperCase()}
		</div>
		<br />
		<div>
			${utilityService.parseCodeMessage('register_admin_body_2', language).message}
			<a href="${FRONTEND_LOCATION}/account-confirmation/${savedUser.activationId}" onClick="sendEmail()">Activare cont</a>
		</div>
		<br />
	</body>
	</html>
	`
    } );
	/**
	 * <div>
			${utilityService.parseCodeMessage('register_admin_body_3', language).message}
		</div>
		<div>
			${FRONTEND_LOCATION}/account-confirmation/${savedUser.activationId}
		</div>
	 */
};

module.exports = confirmAccountAdmin;
