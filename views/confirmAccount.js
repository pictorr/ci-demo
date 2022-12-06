const utilityService = require('../utils/utilityService.js');

const confirmAccount = (user, language) => {
	return ( {
		subject: utilityService.parseCodeMessage('register_user_subject', language).message,
		html:
			`
	<!DOCTYPE html>
	<html>
	
	<body>
		<div>
		    ${utilityService.parseCodeMessage('register_user_body_1', language).message} 
		</div>
		<br />
		<div>
		    ${utilityService.parseCodeMessage('register_user_body_2', language).message} 
		</div>
		<br />
		<div>
		    ${utilityService.parseCodeMessage('register_user_body_3', language).message} 
		</div>
		<br />
		<br />
		<br />
		<br />
		<br />
		<div>
			${utilityService.parseCodeMessage('signature', language).message}  
		</div>
	</body>
	</html>
	`
	} );
};

module.exports = confirmAccount;
