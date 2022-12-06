const utilityService = require('../utils/utilityService.js');

const disableAccount = (user, language) => {
    return ( {
        subject: utilityService.parseCodeMessage('disable_user_subject', language).message,
        html:
            `
	<!DOCTYPE html>
	<html>
	
	<head>
	    <title>Cont activat</title>
	</head>
	<body>
		<div>
			${utilityService.parseCodeMessage('disable_user_body', language).message}	  
		</div>
		<br />
		<br />
		<br />
		<div>
            ${utilityService.parseCodeMessage('thank_you', language).message}
        </div>
		<br />
		<div>
			${utilityService.parseCodeMessage('signature', language).message}
		</div>
	</body>
	</html>
	`
    } );
};

module.exports = disableAccount;
