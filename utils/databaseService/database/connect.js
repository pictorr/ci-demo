const mongoose = require('mongoose');

const connect = () => {
	mongoose.connect(`mongodb://${ global.DB_HOST }/${ global.DB_NAME }`, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	});
	mongoose.Promise = global.Promise;
	// Check for errors on connecting
	let connection = mongoose.connection;
	connection.on('error', error => {
		// Log error
		console.log(`The following error has occurred: ${ error }`);
		// Log connection details
		console.log(`Environment: ${ global.NODE_ENV }`);
		console.log(`Host: ${ global.DB_HOST }`);
		console.log(`Port: ${ global.DB_PORT }`);
		console.log(`Database: ${ global.DB_NAME }`);
		// Stop the server
		process.exit(1);
	});

	connection.on('open', () => {
		console.log(`Successfully connected to database ${ global.DB_NAME } at ${ global.DB_HOST }`);
	});

	// Require all database models
	require('./models.js');
};

module.exports = {
	connect
};