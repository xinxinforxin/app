var client = require('util-restify');
var async = require('async');
var oauth = require('../../lib/oauth');
var valid = require('../../lib/validate');
var log4js = require('log4js');
var logger = log4js.getLogger();
var sms = require('util-sms');
module.exports = function(router){


	//充值页面(银行卡信息 在data.value的userMoney中)
	// router.get('/deposit', oauth.authorise(), function(req, res) {
	// 	//获取用户信息，里面包含银行卡信息
	// 	client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
	// 		// console.info(data.value);
	// 		res.send(data);
	// 	})
	// });
	//接受连连充值返回信息
	router.post('/rechargeMessage',function(req,res){
		var t = valid(req.body, ['oid_partner', 'sign_type', 'sign','dt_order','no_order','oid_paybill','money_order','result_pay','pay_type'], res);
		if(!t){
			return false;
		};

		var oid_partner=req.body.oid_partner;
		var sign_type = req.body.sign_type;
		var sign = req.body.sign;
		var dt_order = req.body.dt_order;
		var no_order = req.body.no_order;
		var oid_paybill = req.body.oid_paybill;
		var money_order = req.body.money_order;
		var result_pay = req.body.result_pay;
		var pay_type = req.body.pay_type;

		var settle_date = req.body.settle_date;
		var info_order = req.body.info_order;
		var bank_code = req.body.bank_code;
		var no_agree = req.body.no_agree;
		var id_type = req.body.id_type;
		var id_no = req.body.id_no;
		var acct_name = req.body.acct_name;
		var card_no = req.body.card_no;


		var jdata = {};
		jdata.oid_partner = oid_partner;
		jdata.sign_type = sign_type;
		jdata.sign = sign;
		jdata.dt_order = dt_order;
		jdata.no_order = no_order;
		jdata.oid_paybill = oid_paybill;
		jdata.money_order = money_order;
		jdata.result_pay = result_pay;
		jdata.pay_type  = pay_type;

		if(settle_date)
			jdata.settle_date = settle_date;
		if(info_order)
			jdata.info_order = info_order;
		if(bank_code)
			jdata.bank_code = bank_code;
		if(no_agree)
			jdata.no_agree = no_agree;
		if(id_type)
			jdata.id_type = id_type;
		if(id_no)
			jdata.id_no = id_no;
		if(acct_name)
			jdata.acct_name = acct_name;
		if(card_no)
			jdata.card_no = card_no;
		var t = valid(req.body,['oid_partner'],res);
		if(!t){
			return false;
		}		
		
		client.post("/lianlian",jdata, function(er, rq, rs, result){
			if(er)
				return res.send(err);
			return res.send(result);
		})
	});
	//充值操作
	router.post('/deposit', oauth.authorise(), function(req, res) {
		var d = req.body;
		logger.trace('充值操作 接收参数----->', d+"---"+d.passwd+"---"+ d.bankNo+"---"+ d.amount+"---"+ d.payDataBean);
		var t = valid(req.body, ['passwd', 'bankNo', 'amount'], res);
		if(!t){
			return false;
		}

		var _data = {
			terminal: 2,
			paypwd: d.passwd,
			cardId: d.bankNo,
			amount: d.amount,
			payType: d.payType,
			signatureParam: d.payDataBean,
			ic: d.ic,
			username: d.username
		};

		logger.debug("_data::"+_data);

		client.post_form('/trade/deposit/' + req.user.id, _data, function(er, rq, rs, data) {
			logger.trace("----->>>"+er+"--");
			logger.trace(er+' 充值操作 返回数据----->', data);
			if(data.code == 0){
				sms.send(d.mobile, 'cz', {
		           'money': d.amount
		        }, function(err, v) {
		           logger.trace('err',err);
		           logger.trace('v',v);
		           logger.trace('验证码| ' + req.query.mobile + ' | ' + code);
		        });
			}
			res.send(data);
		});
	});

	//充值操作
	router.post('/asyncdeposit', oauth.authorise(), function(req, res) {
		var d = req.body;
		logger.trace('充值操作 接收参数----->', d);
		var t = valid(req.body, ['passwd', 'bankNo', 'amount'], res);
		if(!t){
			return false;
		}
		
		client.post_form('/trade/asyncdeposit/' + req.user.id, {
			terminal: 2,
			paypwd: d.passwd,
			cardId: d.bankNo,
			amount: d.amount
		}, function(er, rq, rs, data) {
			logger.trace('充值操作 返回数据----->', data);
			res.send(data);
		});
	});

	//充值查询是否成功
	
	router.get('/queryasyncdeposit/:id', oauth.authorise(), function(req, res) {

			client.get("/trade/" + req.params.id, null, function(err, rq, rs, data){
				logger.trace('trade 返回 ----->', data);
				var _data = data;
				if(data.value.status != 1){
					_data = {
						code: -1,
						detail: "充值失败"
					}
				}else{
					sms.send(d.mobile, 'cz', {
			           'money': data.value.amount
			        }, function(err, v) {
			           logger.trace('err',err);
			           logger.trace('v',v);
			           logger.trace('验证码| ' + req.query.mobile + ' | ' + code);
			        });
				}
				res.send(_data);
			})
		});
	
	
	//提现页面
	
	// router.get('/withdraw', oauth.authorise(), function(req, res) {
	// 	//获取用户信息，里面包含银行卡信息，可提现金额
	// 	client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
	// 		// console.info(data.value);
	// 		res.send(data);
	// 	})
	// });

	//提现操作
	router.post('/withdraw', oauth.authorise(), function(req, res) {
		var d = req.body;
		logger.trace('提现操作 接收参数----->', d);
		var t = valid(req.body, ['passwd', 'bankNo', 'amount'], res);
		if(!t){
			return false;
		}
		
		client.post_form('/trade/withdrawapply/' + req.user.id, {
			terminal: 2,
			paypwd: d.passwd,
			cardId: d.bankNo,
			amount: d.amount
		}, function(er, rq, rs, data) {
			logger.trace('提现操作 返回数据----->', data);
			res.send(data);
		});
	});

	
	//赎回页面
	router.get('/redeem', oauth.authorise(), function(req, res) {
		//获取userMoney 信息，invest 信息
		async.parallel({
			'user_info':function(cb){
				client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
					logger.trace('赎回页面获取 user_info 信息 data ----->', data);
					var cards = data.value.userMoney.cards || {};
					var _card = [];
					for (var i in cards) {
						var card = JSON.parse(cards[i]);
						if (card.disabled == '0') {
							_card.push(card);
						}
					}
					// data.value.userMoney.cards = _card.reverse();
					cb(null, data.value);
				})
			},
			'invest':function(cb){
				var data = {
					"SEQ@userId": req.user.id
				}
				client.get("/invest/search",{
					condition:JSON.stringify(data)
				},function(err,rq,rs,data){
					logger.trace('赎回页面获取 invest 信息 data ----->', data);
					cb(null, data.aaData);
				})
			}
		},function(err,v){
			logger.trace('赎回页面请求 返回数据----->', v);
			res.send(v);
		});
		
	});
	
	//赎回操作
	
	router.post('/redeem', oauth.authorise(), function(req, res) {
		var d = req.body;
		logger.trace('赎回操作请求数据 ----->', d);
		var t = valid(req.body, ['productNo', 'paypwd', 'amount'], res);
		if(!t){
			return false;
		}
		var data = {
			productNo :d.productNo,
			paypwd: d.paypwd,
			amount: d.amount,
			terminal: '2'
		}
		

		client.put_form('/product/redeem/' + req.user.id, data , function(err, rq, rs, data){
			logger.trace('赎回操作返回数据 ----->', data);
			res.send(data);
		})
	});
	
	//交易流水
	
	router.get('/list', oauth.authorise(), function(req, res) {
		var condition = {
			"SEQ@userId" : req.user.id,
			"DORDER": "time"
		}
		logger.trace('交易流水请求参数 ----->', condition);
		client.get("/trade/search",{
			condition:JSON.stringify(condition)
		}, function(err, rq, rs, data){
			logger.trace('交易流水返回数据 ----->', data);
			res.send(data.aaData);
		})
	});

	//用户查询trade交易是否成功
	router.get('/:id', oauth.authorise(), function(req, res) {
		var _type = req.query.type;
		var _bankNo = req.query.bankNo;
		var _amount = req.query.amount;
		var _action = req.query.action;
		var _payType = req.query.payType;

		var code = -101;
		logger.trace(' 传入 type ----->', _type);
		var t = valid(req.query, ['type','amount','action','payType'], res);
		if(!t){
			return false;
		}

		var _data = {
			type:_type,
			amount:_amount,
			bankNo:_bankNo,
			action:_action,
			payType:_payType
		}

		logger.trace(' 传入 type2 ----->', _data);

		client.get("/trade/" + req.params.id, _data, function(err, rq, rs, data){

			logger.trace(err);

			logger.trace('trade 返回 ----->', data);
			logger.trace('trade.value 返回 --11--->', data.code);

			//交易实体是存在的
			if(data.code == 100){
				if(data.value.trade.status == 1 ){
					//支付成功
					code = 1;
					logger.trace('trade status is suscc:', code);
				}else if(data.value.status == 0){
					//等待验证
					code = 0;
					logger.trace('trade status is waitting for paying:',code);
				}else if(data.value.status == -1){
					//支付失败
					code = -1;
					logger.trace('trade status is faillure :',code);
				}else{
					//其他状态
					code = -2;
					logger.trace('trade status is :',code);
				}
			}else{
				//找不到该交易
				code = -3;
				logger.trace('trade is not exist:',code);
			}

			data.code = code;
			return res.send(data);

		})

		//@modify liaozhida 2015-12-17
		/*async.auto({
			'trade':function(cb){
				logger.trace('trade 查询 ----->', req.params.id);
				client.get("/trade/" + req.params.id, null, function(err, rq, rs, data){
					logger.trace('trade 返回 ----->', data);
					logger.trace('trade.value 返回 --11--->', data.value);

					//交易实体是存在的
					if(data.code == 0){
						if(data.value.status == 1 ){
							//支付成功
							code = 1;
							logger.trace('trade status is suscc:', code);
						}else if(data.value.status == 0){
							//等待验证
							code = 0;
							logger.trace('trade status is waitting for paying:',code);
						}else if(data.value.status == -1){
							//支付失败
							code = -1;
							logger.trace('trade status is faillure :',code);
						}else{
							//其他状态
							code = -2;
							logger.trace('trade status is :',code);
						}
					}else{
						//找不到该交易
						code = -3;
						logger.trace('trade is not exist:',code);
					}

					cb(null, data.value);

				})
			},
			'invest':['trade', function(cb,result){

				if(result.trade === null){
					logger.trace("trade info is :"+result);
					logger.trace('trade is fail, so no invest:',code);
					cb(null,result.trade);
				}else{
					var orderNo = result.trade.orderNo;

					if(orderNo===null){
						code = 0;
						cb(null, null);
						return;
					}


					if(type == '10'){//国宝计划详情
						var condition = {
							"orderNo" :orderNo
						}
						logger.trace('guobao invest_orderNo ----->', orderNo);
						client.get("/commonquery/querywithargs/sucPayShow",{
							condition:JSON.stringify(condition)
						},function(err, rq, rs, data){
							logger.trace('invest 返回 ----->', data);

							if(data===undefined){
								code = 0;
								cb(null, null);
								return;
							}

							cb(null, data);
						})
					}else{//定期，活期
						var condition = {
							"SEQ@orderNo" :orderNo
						}
						logger.trace('invest_orderNo ----->', orderNo);
						client.get("/invest/search",{
							condition:JSON.stringify(condition)
						},function(err, rq, rs, data){
							logger.trace('invest 返回 ----->', data);

							if(data.aaData===undefined){
								code = 0;
								cb(null, null);
								return;
							}

							if(data.aaData.length===0){
								code = 0;
							}
							cb(null, data.aaData);
						})
					}
				}
			}]

		},function(err,v){
			v.code = code;
			logger.trace('trade 总返回 ----->', v);
			res.send(v);
		})*/
		
	})
}
