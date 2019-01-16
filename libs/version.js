/** Keeps track of which release channel absinthe is in
 * "development" enables 
 * 
 */

'use strict'

const ENV_VAR = 'ABSINTHE_RELEASE_CHANNEL',
      DEVELOPMENT = 'development',
      PRODUCTION = 'production',
      DEFAULT_CHANNEL = DEVELOPMENT;

function channel(){
	return process.env[ENV_VAR];
}

function isDevelopment() {
	return channel() == DEVELOPMENT;
}

function isProduction() {
	return channel() == PRODUCTION;
}

if (channel() === undefined) {
	process.env[ENV_VAR] = DEFAULT_CHANNEL;
	require('./logging.js')
	.info(`[init] \$${ENV_VAR} was not specified. Defaulting to '${DEFAULT_CHANNEL}'.`);
}

module.exports = {
	channel: channel,
	isDevelopment: isDevelopment,
	isProduction: isProduction,
};