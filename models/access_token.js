var mongoose = require('mongoose');

var OAuthAccessTokensModel = function() {

	var OAuthAccessTokensSchema = mongoose.Schema({
		accessToken: {
			type: String,
			required: true,
			unique: true
		},
		clientId: String,
		userId: {
			type: String,
			required: true
		},
		expires: Date
	});

	return mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema, 'oauth_accesstokens');
};

module.exports = new OAuthAccessTokensModel();