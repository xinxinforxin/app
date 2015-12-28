var async = require('async');
var client = require('util-restify');
var oauth = require('../../lib/oauth');
var moment = require('moment');
var log4js = require('log4js');
var logger = log4js.getLogger();
module.exports = function(router){

	//首页信息
	router.get('/',  function(req, res) {
		async.parallel({
			//首页轮播图
			'banner': function(cb){
				var condition = {
					"IBT@type":"60@69"
				}
				client.get("/doc/search",{condition:JSON.stringify(condition)}, function(err, rq, rs, data){
					logger.trace('首页轮播图 data ------>', data);
					cb(null, data.aaData);
				})
			},
			//新手标
			'newUserActivity':function(cb){
				var condition = {
					"IEQ@type":"3"
				}
				client.get("/product/search",{
					condition:JSON.stringify(condition)
				},function(err, rq, rs, data){
					//将字符串转成JSON格式
					// for(var i = 0; i<data.length; i++){
					// 	var scope = JSON.parse(data[i].scope);
					// 	data[i].scope = scope;
					// }
					logger.trace('首页新手标 data ------>', data);
					cb(null, data.aaData);
				})
			},
			//新手数量
			'newUserAccount':function(cb){
				var condition = {
					"type":"3",
					"status":"2"
				}
				client.get("/commonquery/querywithargs/newUserAccount",{
					condition:JSON.stringify(condition)
				},function(err, rq, rs, data){
					//将字符串转成JSON格式
					// for(var i = 0; i<data.length; i++){
					// 	var scope = JSON.parse(data[i].scope);
					// 	data[i].scope = scope;
					// }
					logger.trace('首页新手标 data ------>', data);
					cb(null, data);
				})
			},
			//每类产品在售的数据(保理在售和今日售罄的数据)
			'sale_product': function(cb){
				client.get("/commonquery/querynoargs/indexShowProduct", null, function(err, rq, rs, data){
					var sysTime = moment().format('YYYY-MM-DD HH:mm:ss');
					for(var i = 0; i<data.length; i++){
						var scope = JSON.parse(data[i].scope);
						var memo = JSON.parse(data[i].memo);
						data[i].scope = scope;
						data[i].memo = memo;
						data[i]['sysTime'] = sysTime;
					}
					logger.trace('首页sale_product data ------>', data);
					cb(null, data);
				})
			},
			'huoqi_product': function(cb){
				var condition = {
					"IEQ@type":"1"
				}
				client.get("/product/search",{
					condition:JSON.stringify(condition)
				},function(err, rq, rs, data){
					logger.trace('首页huoqi_product data ------>', data);
					cb(null, data.aaData);
				})
			},
			'dingqi_product': function(cb){
				var condition = {
					"IEQ@type":"2"
				}
				client.get("/product/search",{
					condition:JSON.stringify(condition)
				},function(err, rq, rs, data){
					logger.trace('首页dingqi_product data ------>', data);
					cb(null, data.aaData);
				})
			}
		}, function(er, v){
			logger.trace('首页 er ------>', er);
			logger.trace('首页返回数据 ------>', v);
			res.send(v);
		});
		
	});
	
}