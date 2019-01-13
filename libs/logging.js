/* here's how logging levels are used:

level: description
	- examples

error: Something wrong happened that is independent of the user
	- Can't connect to database
	- Query for username returns multiple users

warn: Something wrong happened that is caused by the user, but shouldn't be normally possible
	- Uploaded file was too large

info: Useful information to keep track of
	- Application started
	- User logged in, uploaded an image, etc

verbose: Something wrong was caused by the user, but is normally possible
	- Too weak a password
	- Attempting to use a page whilst not logged in

debug: Something correct happened that we want to log
	- Password was successfully validated
	- User id lookup from username was successful

silly: log EVERYTHING!
	- Omitting a field in a form

*/

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');


var logger = createLogger({
	level: (process.env.NODE_ENV === 'production') ? 'info' : 'silly',
	format: format.simple(),
	transports: [
		new (transports.DailyRotateFile)({
			filename: '../logs/absinthe-%DATE%.log',
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		}),
	],

	exceptionHandlers: [
		new (transports.DailyRotateFile)({
			filename: '../logs/absinthe-%DATE%.exceptions.log',
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		}),
	]

});

module.exports = logger;

if (process.env.NODE_ENV !== 'production') {
	logger.add(new transports.Console({ stderrLevels: ['error', 'warn', 'info']}));
}

logger.info('[init] Started up logger with level=' + logger.level)