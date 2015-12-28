var client = require('util-restify');
var async = require('async');
var oauth = require('../../lib/oauth');
var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function(router){

	//获取用户指定类型券，指定状态下的券
	router.get('/:type/:status', oauth.authorise(), function(req, res) {
			var data = {
				"SEQ@userId": req.user.id,
				"IEQ@type": req.params.type,
				"IEQ@status": req.params.status
			}
			client.get("/ticket/search",{
				condition:JSON.stringify(data)
			}, function(err, rq, rs, _data){
				res.send(_data.aaData);
			})
		});
}