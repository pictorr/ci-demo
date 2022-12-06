const frontend = global.FRONTEND_LOCATION;
const utilityService = require('../utils/utilityService.js');


const resetPassword = (user, language) => {
    return ({
        subject: utilityService.parseCodeMessage('pass_reset_subject', 'ro').message,
        html:
            `
	<!DOCTYPE html>
	<html>
	
	<head>
	    <title>Resetare parola</title>
	</head>
	<body>
		<br />
        <div>
            ${utilityService.parseCodeMessage('pass_reset_body_1', language).message}
            <a href="${ frontend }/reset-password/${ user.resetPasswordId }" target="_blank" >
                ${ frontend }/reset-password/${ user.resetPasswordId }
            </a>
        </div>
		<br />
        <br />
        <br />
        <div>
            ${utilityService.parseCodeMessage('thankyou', language).message}
        </div>
        <br />
        <div>
            ${utilityService.parseCodeMessage('signature', language).message}
        </div>
	</body>
	</html>
	`
    });
};

module.exports = resetPassword;