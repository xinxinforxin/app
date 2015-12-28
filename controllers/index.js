var oauth = require('../lib/oauth');
var Client = require('../models/client');
var Access = require('../models/access_token');
var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function(router) {

	router.get('/', function(req, res) {
		res.render('/account/login');
	});

	router.all('/oauth/token', oauth.grant());

	router.get('/', oauth.authorise(), function(req, res) {
		logger.error(req.user);
		// res.send('Secret area');
		res.redirect('/index');
	});


	router.get('/init', function(req, res) {
		// Access.find({},function(e,i){
		// 	console.info(i);
		// 	res.send('s');
		// })
		Client.create({
			clientId: 'ios',
			clientSecret: '6de5191ab3c401bcb266dff913',
			redirectUri: '/oauth/redirect'
		}, function() {
			res.send('ok');
		});

	});
};