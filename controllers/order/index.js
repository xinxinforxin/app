var async = require('async');
var client = require('util-restify');
var oauth = require('../../lib/oauth');
var moment = require('moment');
var valid = require('../../lib/validate');
var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function(router){

	//支付订单页面
	router.get('/:id/pay', oauth.authorise(), function(req, res) {
		async.parallel({
			'user_info' : function(cb){
				client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
					logger.trace('******user_info return paramaters：*******');
					var cards = data.value.userMoney.cards || {};
					var _card = [];
					for (var i in cards) {
						var card = JSON.parse(cards[i]);
						if (card.disabled == '0') {
							_card.push(card);
						}
					}
					// data.value.userMoney.cards = _card.reverse();
					logger.trace(data);
					logger.trace('******user_info return paramaters over******');
					cb(null,data);
				})
			},
			'order_info':function(cb){
				var condition = {
					"userId": req.user.id,
					"orderNo":req.params.id,
					"status":""
				}
				logger.trace('支付订单页面order查询条件------>', condition);
				client.get("/commonquery/querywithargs/orderByCondition",{
					condition:JSON.stringify(condition)
				}, function(err, rq, rs, data){
					logger.trace('支付订单页面order返回数据为------>', data);
					if(data.length > 0){
						var sysTime = moment().format('YYYY-MM-DD HH:mm:ss');
						data[0]['sysTime'] = sysTime;
					}
					
					cb(null,data);
				})
			},
			'ticket':function(cb){
				var condition = {
					"SEQ@userId":req.user.id,
					"IEQ@status":"0",
					"AORDER":"type",
					"DORDER":"begin_date"
				}
				logger.trace(' tickets:', condition);
				client.get("/ticket/search",{
					condition:JSON.stringify(condition)
				}, function(err, rq, rs, data){
					logger.trace(' tickets back:', data);
					cb(null,data.aaData);
				})
			}
		}, function(err,v){
			logger.trace(' err ------>', err);
			logger.trace('支付页面返回数据 ------>', v);
			res.send(v);
		})
		
	});
	
	//获取用户信息 和券信息
	router.get('/userAccount', oauth.authorise(), function(req, res) {
		async.parallel({
			'user_info' : function(cb){
				client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
					logger.trace('******user_info return paramaters：*******');
					var cards = data.value.userMoney.cards || {};
					var _card = [];
					for (var i in cards) {
						var card = JSON.parse(cards[i]);
						if (card.disabled == '0') {
							_card.push(card);
						}
					}
					// data.value.userMoney.cards = _card.reverse();
					logger.trace(data);
					logger.trace('******user_info return paramaters over******');
					cb(null,data);
				})
			},
			'ticket':function(cb){
				var condition = {
					"SEQ@userId":req.user.id,
					"IEQ@status":"0",
					"AORDER":"type",
					"DORDER":"begin_date"
				}
				logger.trace(' tickets:', condition);
				client.get("/ticket/search",{
					condition:JSON.stringify(condition)
				}, function(err, rq, rs, data){
					logger.trace(' tickets back:', data);
					cb(null,data.aaData);
				})
			}
		}, function(err,v){
			logger.trace(' err ------>', err);
			logger.trace('支付页面返回数据 ------>', v);
			res.send(v);
		})
		
	});

	//订单支付
	router.post('/:id/pay', oauth.authorise(), function(req, res) {
		var d = req.body;
		var t = valid(req.body, ['bankNo', 'passwd'], res);
		if(!t){
			return false;
		}
		logger.trace('订单支付 req.body为------>', d);
		client.put('/order/asyncpay/' + req.params.id, {
			tickets: JSON.parse(d.tickets),
			bankNo: d.bankNo,
			passwd: d.passwd,
			terminal: 2,
			payType: d.payType
		}, function(er, rq, rs, data) {
			logger.trace('订单支付 返回数据为------>', data);
			res.send(data);
		});
	});

	//订单取消
	router.get('/cancel/:id', oauth.authorise(), function(req, res) {
		var t = valid(req.params, ['id'], res);
		if(!t){
			return false;
		}
		client.del('/order/' + req.params.id, null, function(er, rq, rs, data) {
			logger.trace('订单取消 返回数据为------>', data);
			res.send(data);
		});
	});

	//创建订单
	router.post('/add', oauth.authorise(), function(req, res){
		var d = req.body;
		var t = valid(req.body, ['productId', 'amount', 'cycle'], res);
		if(!t){
			return false;
		}
		logger.trace('创建订单 req.body为------>', d);
		// var _data = {
		// 	"productId": d.productId,
		// 	"amount": d.amount,
		// 	"userId": req.user.id,
		// 	"cycle":d.cycle
		// }
		// logger.trace('创建订单 传到java后台数据为------>', _data);
		// client.post('/order', _data, function(er, rq, rs, result){
		// 	logger.trace('创建订单 返回数据为------>', result);
		// 	res.send(result);
		// });
		async.auto({
			'createOrder':function(cb){

				//var _data = {
				//	terminal: 2,
				//	paypwd: d.passwd,
				//	cardId: d.bankNo,
				//	amount: d.amount,
				//	payType: d.payType,
				//	signatureParam: d.payDataBean
				//};

				var _data = {
					"productId": d.productId,
					"amount": d.amount,
					"userId": req.user.id,
					"cycle":d.cycle
				}

				var _order = JSON.stringify(_data);

				var n_data = {
					order:_order,
					signatureParam: d.payDataBean,
					payType: d.payType,
					username: d.username,
					ic: d.ic,
					passwd: d.passwd
				}

				logger.trace('创建订单 传到java后台数据为------>', n_data);
				client.post_form('/order', n_data, function(er, rq, rs, result){
					logger.trace('创建订单 返回数据为------>', result);
					if(result.code == 0){
						cb(null, result);
					}else{
						cb(-1, result);
					}
				});
			},
			'user_info':['createOrder', function(cb){
				client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
					logger.trace('******user_info ：*******');
					var cards = data.value.userMoney.cards || {};
					var _card = [];
					for (var i in cards) {
						var card = JSON.parse(cards[i]);
						if (card.disabled == '0') {
							_card.push(card);
						}
					}
					// data.value.userMoney.cards = _card.reverse();
					logger.trace(data);
					logger.trace('******user_info over******');
					cb(null,data);
				})
			}],
			'ticket':['createOrder', function(cb){
				var condition = {
					"SEQ@userId":req.user.id,
					"IEQ@status":"0",
					"AORDER":"type",
					"DORDER":"begin_date"
				}
				logger.trace(' tickets:', condition);
				client.get("/ticket/search",{
					condition:JSON.stringify(condition)
				}, function(err, rq, rs, data){
					logger.trace(' tickets back:', data);
					cb(null,data.aaData);
				})
			}]
		}, function(err, v){
			logger.trace('back err:', err);
			logger.trace('back data:', v);
			res.send(v);
		})
	});

	//购买新手标订单
	router.post('/virtualOrder', oauth.authorise(), function(req, res) {
		var t = valid(req.body, ['productId', 'ticketId', 'passwd'], res);
		if(!t){
			return false;
		}
		client.put_form('/order/tyq/' + req.user.id, {
			productId:req.body.productId,
			ticketId: req.body.ticketId,
			passwd: req.body.passwd 
		}, function(er, rq, rs, data) {
			logger.trace('订单支付 返回数据为------>', data);
			res.send(data);
		});
	});
	
	
	
}

