const utilityService = require('../utils/utilityService.js');

const adminAddCounty = user => {
	let counties = ''
	user.cities.map(county => {
		if (county.selected === true) {
			counties += county.county + ",\n"
		}
	})
    return ( {
        subject: utilityService.parseCodeMessage('county_change_subject', 'ro').message,
        html:
            `
	<!DOCTYPE html>
	<html>
	
	<body>
		<div>
		    ${utilityService.parseCodeMessage('county_change_body', 'ro').message} 
		</div>
		<br />
		<div>
			${counties}
		</div>
		<br />
		<div>
			${utilityService.parseCodeMessage('signature', 'ro').message}  
		</div>
	</body>
	</html>
	`
    } );
};

module.exports = adminAddCounty;
