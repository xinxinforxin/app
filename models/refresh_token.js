var mongoose = require('mongoose');

var OAuthRefreshTokensModel = function() {

	var OAuthRefreshTokensSchema = mongoose.Schema({
		refreshToken: {
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

	return mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema, 'oauth_refreshtokens');
};

module.exports = new OAuthRefreshTokensModel();