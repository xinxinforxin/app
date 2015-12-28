var oauth = require('./oauth');

module.exports = function() {
	return oauth.errorHandler();
};