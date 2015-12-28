var client = require('util-restify');
var async = require('async');
var oauth = require('../../lib/oauth');
var moment = require('moment');
var valid = require('../../lib/validate');
var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function(router){


	//获取产品列表
	router.get('/list',  function(req, res) {
		async.parallel({
			'baoli_product':function(cb){
				client.get("/commonquery/querynoargs/indexShowProduct", null, function(err, rq, rs, data){
					var sysTime = moment().format('YYYY-MM-DD HH:mm:ss');
					for(var i = 0; i<data.length; i++){
						var scope = JSON.parse(data[i].scope);
						var memo = JSON.parse(data[i].memo);
						data[i].scope = scope;
						data[i].memo = memo;
						data[i]['sysTime'] = sysTime;
					}
					logger.trace('获取产品列表 baoli_product 获取的数据为------>', data);
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
					logger.trace('获取产品列表 huoqi_product 获取的数据为------>', data);
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
					logger.trace('获取产品列表 dingqi_product 获取的数据为------>', data);
					cb(null, data.aaData);
				})
			}
		},function(er,v){
			logger.trace('获取产品列表 er------>', er);
			logger.trace('获取产品列表 返回数据为------>', v);
			res.send(v);
		})
	});

	//不同类型产品列表
	router.get('/list/:type',  function(req, res) {
		var type = req.params.type;
		var pageIndex = req.query.pageIndex - 1;
		var pageSize = req.query.pageSize;
		logger.trace('type', type);
		logger.trace('pageIndex, pageSize', req.query);
		if(type == '10'){
			var condition = {
				"type":type,
				"pageIndex":pageIndex,
				"pageSize":pageSize
			}
			client.get("/commonquery/querywithargs/productList", {
				condition:JSON.stringify(condition)
			}, function(err, rq, rs, data){
				var sysTime = moment().format('YYYY-MM-DD HH:mm:ss');
				for(var i = 0; i<data.length; i++){
					var scope = JSON.parse(data[i].scope);
					var memo = JSON.parse(data[i].memo);
					data[i].scope = scope;
					data[i].memo = memo;
					data[i]['sysTime'] = sysTime;

				}
				logger.trace('获取产品列表获取的数据为------>', data);
				res.send(data);
			})
		}else{
			var condition = {
				"IEQ@type":type,
				"iDisplay": pageIndex,
				"iDislength":pageSize
			}
			client.get("/product/search",{
				condition:JSON.stringify(condition)
			},function(err, rq, rs, data){
				logger.trace('获取产品列表获取的数据为------>', data);
				res.send(data.aaData);
			})
		}
	});
	

	//获取产品详细信息
	router.get('/:type/:id',  function(req, res) {
		var t = valid(req.params, ['id', 'type'], res);
		if(!t){
			return false;
		}
		var condition = {
			"type": req.params.type,
			"productId": req.params.id
		}
		logger.trace('获取产品详细信息 查询条件为------>', condition);
		client.get("/commonquery/querywithargs/productDetail",{
			condition:JSON.stringify(condition)
		},function(er,rq,rs,data){
			logger.trace('获取产品详细信息 er为------>', er);
			logger.trace('获取产品详细信息 返回数据为------>', data[0]);
			res.send(data[0]);
		})
	}); 
	
	//获取某产品的投资记录--fanxing
	router.get('/:type/detail/:id', function(req, res){
		var t = valid(req.params, ['id', 'type'], res);
		if(!t){
			return false;
		}
		var data = {
			"type": req.params.type,
			"id": req.params.id
		}
		logger.trace('获取某产品的投资记录 查询条件为------>', data);
		var condition = JSON.stringify(data);
		client.get('/commonquery/querywithargs/productInvestQuery', 
			{condition: condition}, 
			function(er, rq, rs, result){
				var investArr = {
					data: result
				}
				logger.trace('获取某产品的投资记录 返回数据为------>', investArr);
				res.send(investArr);
		});
	});
	
}