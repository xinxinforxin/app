var oauth_model = require('../models/oauth');
var oauthserver = require('node-oauth2-server');

var oauth2 = function() {
	// if (process.env.NODE_ENV == 'development') {
	// 	return {
	// 		grant: function() {
	// 			return function(req, res, next) {};
	// 		},
	// 		authorise: function() {
	// 			return function(req, res, next) {
	// 				req.user = { id: 'tt' };
	// 				next();
	// 			};
	// 		},
	// 		errorHandler: function() {
	// 			return function(err, req, res, next) {};
	// 		}
	// 	};
	// } else {
		return oauthserver({
			model: oauth_model,
			grants: ['password', 'refresh_token'],
			debug: true
		});
	// }
};

module.exports = oauth2();