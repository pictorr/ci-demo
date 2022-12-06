require('dotenv').config();
require('./utils/utilityService.js').autoImportEnvVariables();

// Connect to the database
const connectionService = require('./utils/databaseService/database/connect.js');
connectionService.connect();

global.errorLogger = require('./utils/logger.js').errorLogger;
global.actionLogger = require('./utils/logger.js').actionLogger;

const createError = require('http-errors');
const express = require('express');
const app = express();

const helmet = require('helmet');
app.use(helmet());

// Add ip to requests
const requestIp = require('request-ip');
app.use(requestIp.mw());

// Set request start time
const setTime = require('./api/middleware/requestStartMiddleware.js');
app.use(setTime);

// Set request start time
const getRequestLanguage = require('./api/middleware/getRequestLanguage.js');
app.use(getRequestLanguage);

// CORS Middleware
const cors = require('cors');
app.use(cors());

const compression = require('compression');
const shouldCompress = (req, res) => {
	if (req.headers['x-no-compression']) {
		return false;
	}
	return compression.filter(req, res);
};
app.use(compression({ filter: shouldCompress }));

// Body parser
const bodyParser = require('body-parser');
app.use('/uploads', express.static('./uploads'));
app.use(bodyParser.urlencoded({ extended: false, limit: '200000kb' }));
app.use(bodyParser.json({ extended: false, limit: '200000kb' }));

const decodeTokenMiddleware = require('./api/middleware/decodeTokenMiddleware.js');
app.use(decodeTokenMiddleware);

if (global.NODE_ENV === 'development') {
	const morgan = require('morgan');

	morgan.token('url', req => req.originalUrl.indexOf('login') === -1 ? req.originalUrl : '/login');
	morgan.token('user', req => req.decoded ? req.decoded.emailAddress || req.decoded.id : 'no-user');
	morgan.token('ip', req => req.clientIp || 'no-ip');

	app.use(morgan(':method :status :date :user :ip :url :response-time ms'));
}

const credentialsRouter = require('./api/controllers/credentials.js');
const authenticationRouter = require('./api/controllers/authentication.js');
const dinosaursRouter = require('./api/controllers/dinosaurs.js');
const usersRouter = require('./api/controllers/users.controller.js');
const importsRouter = require('./api/controllers/imports.js');
const offersRouter = require('./api/controllers/offers.js');
const reportsRouter = require('./api/controllers/reports.controller.js');

app.use('/', credentialsRouter);
app.use('/', authenticationRouter);
app.use('/dinosaurs', dinosaursRouter);
app.use('/users', usersRouter);
app.use('/imports', importsRouter);
app.use('/offers', offersRouter);
app.use('/reports', reportsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});

module.exports = app;