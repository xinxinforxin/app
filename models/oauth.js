var AccessToken = require('./access_token');
var RefreshToken = require('./refresh_token');
var Client = require('./client');
var rest = require('util-restify');
var log4js = require('log4js');
var logger = log4js.getLogger();

// node-oauth2-server API
module.exports.getAccessToken = function(bearerToken, callback) {
	logger.trace('getAccessToken----->', bearerToken);
	AccessToken.findOne({
		accessToken: bearerToken
	}, callback);
};

module.exports.saveAccessToken = function(token, clientId, expires, userId, callback) {
	var fields = {
		clientId: clientId,
		userId: userId,
		expires: expires
	};
	logger.trace('saveAccessToken----->', fields);

	AccessToken.update({
		accessToken: token
	}, fields, {
		upsert: true
	}, function(err) {
		if (err) {
			console.error(err);
		}

		callback(err);
	});
};

module.exports.saveRefreshToken = function(token, clientId, expires, userId, callback) {
	logger.trace('saveRefreshToken----->');
	if (userId.id) {
		userId = userId.id;
	}

	var refreshToken = new RefreshToken({
		refreshToken: token,
		clientId: clientId,
		userId: userId,
		expires: expires
	});
	logger.trace('saveRefreshToken----->', refreshToken);

	refreshToken.save(callback);
};

module.exports.getRefreshToken = function(refreshToken, callback) {
	logger.trace('getRefreshToken----->', refreshToken);
	RefreshToken.findOne({
		refreshToken: refreshToken
	}, function(err, token) {
		if (token) {
			token.user = token.userId;
		}
		callback(err, token);
	});
};

module.exports.revokeRefreshToken = function(refreshToken, callback) {
	logger.trace('revokeRefreshToken----->', refreshToken);
	RefreshToken.remove({
		refreshToken: refreshToken
	}, callback);
};

module.exports.getClient = function(clientId, clientSecret, callback) {
	logger.trace('getClient----->', clientId);
	var params = {
		clientId: clientId
	};
	if (clientSecret != null) {
		params.clientSecret = clientSecret;
	}
	Client.findOne(params, callback);
};

//var authorizedClientIds = ['andriod', 'papers3-mac'];

module.exports.grantTypeAllowed = function(clientId, grantType, callback) {
	logger.trace('grantTypeAllowed----->', clientId);
	//if (grantType === 'password' || grantType === 'authorization_code') {
	//	return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
	//} else {
		callback(false, true);
	//}
};

module.exports.getUser = function(mobile, password, cb) {
	logger.trace('getUser mobile----->', mobile);
	logger.trace('getUser password----->', password);
	rest.post_form('/user/login', {
		mobile: mobile,
		passwd: password
	}, function(er, rq, rs, result) {
		logger.trace('getUser er---->', er);
		logger.trace('getUser result---->', result);
		if(result.code == 0){
			cb(null, result.value.userId);
		}else{
			cb(null, null);
		}
	});
};