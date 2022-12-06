const utilityService = require('../utils/utilityService.js');

const adminChangedPassword = (language) => {
    return ( {
        subject: utilityService.parseCodeMessage('pass_changed_subject', language).message,
        html:
            `
	<!DOCTYPE html>
	<html>
	
	<body>
		<div>
		    ${utilityService.parseCodeMessage('pass_changed_body', language).message} 
		</div>
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

module.exports = adminChangedPassword;
