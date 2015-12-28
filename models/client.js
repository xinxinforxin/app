var mongoose = require('mongoose');

var OAuthClientsModel = function() {

	var OAuthClientsSchema = mongoose.Schema({
		clientId: String,
		clientSecret: String,
		redirectUri: String
	});

	return mongoose.model('OAuthClients', OAuthClientsSchema, 'oauth_clients');
};

module.exports = new OAuthClientsModel();