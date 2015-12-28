var log4js = require('log4js');

module.exports = function(options) {
	console.info(options);
	return log4js.connectLogger(log4js.getLogger(options.category), {
		level: options.level
	});
};