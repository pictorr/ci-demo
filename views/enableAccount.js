const utilityService = require('../utils/utilityService.js');

const enableAccount = (user, language) => {
    return ( {
        subject: utilityService.parseCodeMessage('enable_user_subject', language).message,
        html:
            `
	<!DOCTYPE html>
	<html>
	
	<head>
	    <title>Cont activat</title>
	</head>
	<body>
		<div>
			${utilityService.parseCodeMessage('enable_user_body_1', language).message}	  
		</div>
		<br />
		<div>
			${utilityService.parseCodeMessage('enable_user_body_2', language).message}	  
		</div>
		<br />
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

module.exports = enableAccount;
