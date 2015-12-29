var cipher = require('util-cipher');
var oauth = require('../../lib/oauth');
var client = require('util-restify');
var async = require('async');
var random = require('../../lib/random');
var moment = require('moment');
var sms = require('util-sms');
var valid = require('../../lib/validate');
var log4js = require('log4js');
var logger = log4js.getLogger();
module.exports = function(router){

	//登陆操作
	router.post('/login', function(req, res, next) {

		logger.trace('******login recieve paramaters：*******');
		logger.trace(req.body);
		
		var t = valid(req.body, ['mobile', 'passwd', 'client_id', 'client_secret'], res);
		if(!t){
			return false;
		}
		

		//用户名，密码，client_id, client_secret 由前台提供
		req.body['username'] = req.body.mobile;
        req.body['password'] = req.body.passwd;
        req.body['grant_type'] = 'password';

		logger.trace(req.body);
		client.post_form('/user/login', {
			mobile: req.body.mobile,
			passwd: req.body.passwd
		}, function(er, rq, rs, result) {
			if (er) { 
				return res.send({code: 500,msg: 'inner error',data: er});
			};
			if(result.code == -113){
				return res.send(result);
			}
			if(result.code == -112){
				return res.send(result);
			} 
			oauth.grant()(req,res,next);
		})
	});

	//添加，修改手势密码
	
	router.post('/patternPwd', oauth.authorise(), function(req, res) {
		logger.trace("****patternPwd bengin");
		var t = valid(req.body, ['patternPwd'], res);
		if(!t){
			return false;
		}
		logger.trace(req.body);
		var data = {
			patternPwd:req.body.patternPwd
		}
		client.put_form("/user/addpatternpwd/" + req.user.id, data, function(err, rq, rs, _data){
			logger.trace("****patternPwd return");
			logger.trace(_data);
			res.send(_data);
		})
		
	});
	
	//验证密码
	router.post('/verifyTradePwd', oauth.authorise(),function(req, res){
		logger.trace("****change trade pwd ");
		var t = valid(req.body,['passwd'],res);

		if(!t){
			return false;
		}

		var data_ = {userId: req.user.id,passwd: req.body.passwd,action: 'trade'};
		client.post_form("/passwd",data_, function(er, rq, rs, result){
			if(er){
				//logger.trace(er);
				//logger.trace(er);
				return res.send(er);
			}

			return res.send(result);
		})
	})

	//退出登陆（怎么退出？？不需要退出，客户端把id注销掉就ok）--fanxing
	// router.get('/logout', function(req, res){
	// 	res.send();
	// });

	//注册操作
	router.post('/register', function(req, res, next) {
		var data = req.body;
		var t = valid(req.body, ['mobile', 'passwd'], res);
		if(!t){
			return false;
		}
		logger.trace("data ------>");
		logger.trace(data);

		var data_ = {
			mobile: data.mobile,
			// passwd: cipher.md5['+'](data.pwd),
			passwd: data.passwd,  //前端已经加密了
			referee: data.referee,
			termimal: '2'
		};

		client.post('/user', data_, function(er, rq, rs, result) {
			logger.trace('reult==>',result);
			if(result.code == 0){

				req.body['username'] = req.body.mobile;
				req.body['password'] = req.body.passwd;
				req.body['grant_type'] = 'password';
				logger.trace('req.body==>',req.body);

				oauth.grant()(req,res,next);

			}else{
				res.send(result);//返回状态就可以了
			}
			
		});
	});


	//修改登陆密码操作
	router.post('/change_pwd', oauth.authorise(), function(req, res) {
		var data = req.body;
		var t = valid(req.body, ['newPasswd', 'passwd'], res);
		if(!t){

			return false;
		}
		logger.trace('******change_pwd recieve paramaters：*******');
		logger.trace(data);
		var _data = {
			passwd : data.passwd,
			newPasswd : data.newPasswd
		}
		client.put_form('/user/pwd/' + req.user.id, _data, function(er, rq, res_, rs) {
			logger.trace('******change_pwd return paramaters：*******');
			logger.trace(rs);
			logger.trace('******change_pwd return paramaters over******');
			res.send(rs);
		});
	});

	//找回登陆密码操作
	router.post('/find_pwd',  function(req, res) {
		var data = req.body;
		var t = valid(req.body, ['newPasswd'], res);
		if(!t){

			return false;
		}
		logger.trace('******find_pwd recieve paramaters：*******');
		logger.trace(data);
		var _data = {
			// newPasswd: cipher.md5['+'](data.pwd)
			newPasswd: data.newPasswd
		};
		client.put_form('/user/pwd/' + data.mobile, _data, function(er, rq, res_, rs) {
			logger.trace('******find_pwd return paramaters：*******');
			logger.trace(rs);
			logger.trace('******find_pwd return paramaters over******');
			res.send(rs);
		});
	});
	
	//修改支付密码
	router.post('/change_pay_pwd', oauth.authorise(), function(req, res) {
		var t = valid(req.body, ['newPasswd', 'passwd'], res);
		if(!t){

			return false;
		}
		var d = req.body;
		logger.trace('******change_pay_pwd recieve paramaters：*******');
		logger.trace(d);
		async.auto({
			//确认用户信息
			'checkUser':function(cb){
				client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
					var userInfo = data.value;
					console.info(data.value);
					//userInfo中姓名，身份证 和 前台传入的进行对比
					if(userInfo.name == d.name && userInfo.ic == d.ic){
						cb(null,data);
					}else{
						
						var data = {
							code:'-1',
							detail:"用户名或身份证错误"
						}
						cb(-1,data);
					}
				})
			},
			//修改支付密码
			'changePwd':['checkUser',function(cb,result){
				var dd ={
					passwd : d.passwd,
					newPasswd : d.newPasswd
				}
				client.put_form("/user/paypwd/" + req.user.id, dd, function(err, rq, rs, data){
					cb(null, data);
				})
			}]
		}, function(err, v){
			logger.trace('******change_pay_pwd return paramaters：*******');
			logger.trace('err',err);
			logger.trace(v);
			logger.trace('******change_pay_pwd return paramaters over******');
			res.send(v);
		})
	});
	//找回支付密码中的校验用户信息
	router.post('/check_user_info', oauth.authorise(), function(req, res){
		var d = req.body;
		var t = valid(req.body, ['name', 'ic'], res);
		if(!t){

			return false;
		}

		logger.trace('找回支付密码中的校验用户信息 check_user_info 获取参数---->',d);
		client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
			var userInfo = data.value;
			if(userInfo.name == d.name && userInfo.ic == d.ic){
				logger.trace('校验用户信息合法 check_user_info 返回数据---->',data);
				res.send(data);
			}else{
				var obj = {
					code:'-1',
					detail:"用户名或身份证错误"
				}
				res.send(obj);
			}
		});
	});

	//找回支付密码中的修改支付密码
	router.post('/modify_pay_pwd', oauth.authorise(), function(req, res) {
		var d = req.body;
		var t = valid(req.body, ['newPasswd'], res);
		if(!t){

			return false;
		}
		var dd ={
			newPasswd : d.newPasswd
		}
		logger.trace('找回支付密码中的修改支付密码 获取参数---->',d);
		client.put_form("/user/paypwd/" + req.user.id, dd, function(err, rq, rs, data){
			logger.trace('找回支付密码中的修改支付密码 返回数据', data);
			res.send(data);
		})
	});

	//找回支付密码
	router.post('/find_pay_pwd', oauth.authorise(), function(req, res) {
		var d = req.body;
		var t = valid(req.body, ['name', 'ic', 'newPasswd'], res);//校验必填信息是否为空
		if(!t){

			return false;
		}
		logger.trace('******find_pay_pwd recieve paramaters：*******');
		logger.trace(d);

		async.auto({
			//确认用户信息
			checkUser:function(cb){
				client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
					var userInfo = data.value;
					// console.log(userInfo);
					//userInfo中姓名，身份证 和 前台传入的进行对比
					if(userInfo.name == d.name && userInfo.ic == d.ic){
						cb(null,data);
					}else{
						var data = {
							code:'-1',
							detail:"用户名或身份证错误"
						}
						cb(-1,data);
					}
				})
			},
			//修改支付密码
			changePwd:['checkUser',function(cb,result){
				var dd ={
					newPasswd : d.newPasswd
				}
				client.put_form("/user/paypwd/" + req.user.id, dd, function(err, rq, rs, data){
					console.info(data);
					cb(null, data);
				})
			}]
		}, function(err, v){
			logger.trace('******find_pay_pwd return paramaters：*******');
			logger.trace('err',err);
			logger.trace(v);
			logger.trace('******find_pay_pwd return paramaters over******');
			res.send(v);
		})
	});
	

	//获取用户基本信息
	router.get('/finance', oauth.authorise(), function(req, res) {
			
			async.parallel({
				'user_info':function(cb){
					client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
						// console.info(data);
						logger.trace('finance user_info back:', data);
						cb(null, data.value);
					})
				},
				'tickets':function(cb){
					var condition = {
						"SEQ@userId":req.user.id,
						"AORDER": "type",
						"DORDER":"status"
					}
					logger.trace('finance tickets:', condition);
					client.get("/ticket/search",{
						condition:JSON.stringify(condition)
					}, function(err, rq, rs, data){
						logger.trace('finance tickets back:', data);
						cb(null,data.aaData);
					})
				},
				'invest': function(cb){
					var condition = {
						"userId":req.user.id,
						"pageIndex": 0,
						"pageSize": 10
					}
					logger.trace('finance invest:', condition);
					client.get("/commonquery/querywithargs/investedList",{
						condition:JSON.stringify(condition)
					}, function(err, rq, rs, data){
						for(var i = 0; i<data.length; i++){
							if(data[i].cycle == 0 && (data[i].status == 0 || data[i].status == 20)){ //活期 在途或者部分赎回，多加一个字段，显示利率
								var curDate = moment().format('YYYY-MM-DD');//当前时间
								var createDate = data[i]['createTime'].substr(0,10);//购买产品时间

								var day = moment(curDate).diff(moment(createDate), 'days') +1;
								if(parseFloat(data[i]['curRate']) >= 12){//大于等于12，就不会再增加利率
									data[i]['cur_rate'] = parseFloat(data[i]['curRate']);
								}else{
									data[i]['cur_rate'] = parseFloat(data[i]['curRate']) + parseInt(day/30)*0.5;//活期每30天加0.5%的利率
								}
								
							}
						}
						logger.trace('finance invest back:', data);
						cb(null,data);
					})
				},
				'order_unpay':function(cb){
					var condition = {
						"userId": req.user.id,
						"orderNo": "",
						"status":"1"
					}
					logger.trace('finance order_unpay:', condition);
					client.get("/commonquery/querywithargs/orderByCondition",{
						condition:JSON.stringify(condition)
					}, function(err, rq, rs, data){
						var curDate = moment().format('YYYY-MM-DD HH:mm:ss');
						if(data.length > 0){
							data[0]['sysTime'] = curDate;
						}
						logger.trace('finance order_unpay back:', data);
						cb(null,data);
					})
				}
			},function(er,v){
				logger.trace('******finance return paramaters：*******');
				logger.trace('err',er);
				logger.trace(v);
				logger.trace('******finance return paramaters over******');
				res.send(v);
			})
		});
	
	
	//获取银行卡信息， 充值页面的银行卡信息，提现页面银行卡信息，赎回页面（可赎回金额在userMoney里面）
	router.get('/card', oauth.authorise(), function(req, res) {
		client.get("/user/"+ req.user.id, null, function(err, rq, rs, data){
			logger.trace('******card return paramaters：*******');
			logger.trace(data);
			var cards = data.value.userMoney.cards || {};
			var _card = [];
			for (var i in cards) {
				var card = JSON.parse(cards[i]);
				if (card.disabled == '0') {
					_card.push(card);
				}
			}
			logger.trace('******card return paramaters over******');

			res.send(data);
		})
		
	});

	//获取理财券信息
	router.get('/ticket', oauth.authorise(), function(req, res) {
		var condition = {
			"SEQ@userId":req.user.id,
			"DORDER":"status",
			"AORDER":"end_date",
			"DORDER":"amount"
		}
		client.get("/ticket/search",{
			condition:JSON.stringify(condition)
		}, function(err, rq, rs, data){
			logger.trace('******ticket return paramaters：*******');
			logger.trace(data);
			logger.trace('******ticket return paramaters over******');
			res.send(data)
		})
	});

	//获取理财券详情--fanxing
	router.get('/ticket/detail/:id', oauth.authorise(), function(req, res){
		var condition = {
			"SEQ@ticketNo": req.params.id
		}
		client.get('/ticket/search', {
			condition: JSON.stringify(condition)
		}, function(er, rq, rs, result){

			var data = {
				data: result.aaData[0]
			}
			logger.trace('******/ticket/detail/:id return paramaters：*******');
			logger.trace(data);
			logger.trace('******/ticket/detail/:id return paramaters over******');
			res.send(data);
		});
	});

	//绑定银行卡--fanxing
	router.post('/addcard', oauth.authorise(), function(req, res){
		var d = req.body;
		var t = valid(req.body, ['userName', 'ic', 'mobile', 'cardNo', 'checkVerify'], res);//校验必填信息是否为空
		if(!t){

			return false;
		}
		logger.trace('******addcard  recieve paramaters：*******');
		logger.trace(d);
		logger.trace('******addcard  recieve paramaters over******');
		var data_ = {
			userName: d.userName,
			ic: d.ic,
			mobile: d.mobile,//银联需要的绑卡手机号，要求和收到短信手机号一致
			cardNo: d.cardNo,
			bandingPhone: d.mobile,
			checkVerify: d.checkVerify,
			cardType: '0'// 对私
		}
		client.put_form('/user/addcard/'+ req.user.id, data_, function(er, rq, rs, result){
			logger.trace('******addcard  return paramaters：*******');
			logger.trace(result);
			logger.trace('******addcard  return paramaters over******');
			//发短信，提示已绑卡成功
			if(result.code == 0){
				sms.send(d.mobile, 'bindCard', {
		           'name': d.userName,
		           'TIME': moment().format('YYYY-MM-DD HH:mm:ss'),
		           'NUMBER': d.cardNo.substr(d.cardNo.length - 4)
		        }, function(err, v) {
		           logger.trace('err',err);
		           logger.trace('v',v);
		           logger.trace('验证码| ' + req.query.mobile + ' | ' + result.code);
		        });
			}
			res.send(result);
		});  
	});
	
	//解绑银行卡--fanxing
	router.post('/delcard', oauth.authorise(), function(req, res){
		var d = req.body;
		var t = valid(req.body, ['cardId','passwd'], res);
		if(!t){
			return false;
		}
		
		logger.trace('******delcard  recieve paramaters：*******');
		logger.trace(d);
		logger.trace('******delcard  recieve paramaters over******');
		var _data = {
			"cardId": d.cardId,
			"passwd": d.passwd
		}
		client.put_form('/user/delcard/'+ req.user.id, _data, function(er, rq, rs, result){
			logger.trace('******delcard  return paramaters：*******');
			logger.trace(result);
			res.send(result);
		});
	});

	//积分兑换VIP
	router.post('/exchange/vip', oauth.authorise(), function(req, res){
		client.put_form('/user/vip/'+ req.user.id, null, function(er, rq, rs, result){
			logger.trace('******exchange/vip  return paramaters：*******');
			logger.trace(result);
			logger.trace('******exchange/vip  return paramaters over******');
			res.send(result);
		});
	});

	//积分兑换理财券
	router.post('/exchange/ticket', oauth.authorise(), function(req, res){
		var t = valid(req.body, ['amount'], res);
		if(!t){
			return false;
		}
		var data = {
			"amount": req.body.amount
		}
		client.put_form('/user/ticket/'+ req.user.id, data, function(er, rq, rs, result){
			logger.trace('******exchange/ticket  return paramaters：*******');
			logger.trace(result);
			logger.trace('******exchange/ticket  return paramaters over******');
			res.send(result);
		});
	});

	//绑卡时的验证码
	
	router.get('/bindcard_cc', oauth.authorise(),  function(req, res) {
			logger.trace('bindcard_cc :', req.query.mobile);
			var t = valid(req.query, ['mobile'], res);
			if(!t){
				return false;
			}
		client.get("/user/authcode"+ req.query.mobile, null, function(err, rq, rs, data){
			logger.trace('bindcard_cc back:', data);
			res.send(data);
		})
	});
	
	

	//注册，找回登陆密码，找回支付密码，重置登陆密码，重置支付密码  验证码校验
	router.get('/cc', function(req, res){
		logger.trace('****** cc  return paramaters：*******');
		var t = valid(req.query, ['mobile'], res);
		if(!t){
			return false;
		}
		logger.trace(req.query.mobile);
		if(req.query.type == 'zc'){
			var condition = {
				"SEQ@mobile":req.query.mobile,
			}
			client.get("/user/search",{
				condition:JSON.stringify(condition)
			},function(err, rq, rs, data){
				logger.trace('****** cc  返回数据 ******', data);
				if(data.aaData.length >0){
					res.send({
						code:-1,
						detail: "该用户已经注册过了",
						value: ''
					})

				}else{
					logger.trace('发送短信');
					var code = random.v_code();
					sms.send(req.query.mobile, req.query.type, {
			           'code': code
			        }, function(err, v) {
			           logger.trace('err',err);
			           logger.trace('v',v);
			           logger.trace('验证码| ' + req.query.mobile + ' | ' + code);
			           res.send({
				           no: code
			   		   });
			        });	
				}
			})

		}else if(req.query.type == 'findLoginPwd'){
			client.get("/user/userStatus/" + req.query.mobile,{},function(er, rq, rs, result){
				logger.trace('findLoginPwd结果:',result);
				if(result.code == '-111' || result.code == '-112'){
					return res.send({no: result.code});
				}
				logger.trace('发送短信 findLoginPwd');
				var code = random.v_code();
				sms.send(req.query.mobile, req.query.type, {
		           'code': code
		        }, function(err, v) {
		           logger.trace('err',err);
		           logger.trace('v',v);
		           logger.trace('验证码| ' + req.query.mobile + ' | ' + code);
		           res.send({
			           no: code
		   		   });
		        });
			})

		}else{

			
			logger.trace('发送短信');
			var code = random.v_code();
			sms.send(req.query.mobile, req.query.type, {
	           'code': code
	        }, function(err, v) {
	           logger.trace('err',err);
	           logger.trace('v',v);
	           logger.trace('验证码| ' + req.query.mobile + ' | ' + code);
	           res.send({
		           no: code
	   		   });
	        });
		}
		
        
	});



	//获取交易密码
	router.get('/get_pay_pwd', oauth.authorise(), function(req, res){
		client.get("/user/"+ req.user.id, null, function(er, rq, rs, data){
			if(er){
				logger.trace("获取交易密码------>", er);
				return false;
			}
			logger.trace('获取交易密码----->', data);
			var obj = {
				"code": 0,
				"detail": null,
				"value": {
					"userId": data.value.userMoney.userId,
					"payPasswd": data.value.userMoney.payPasswd,
					"ic": data.value.ic
				}
			}
			logger.trace('获取交易密码 返回数据----->', obj);
			res.send(obj);
		})
	});

	//获取app版本信息
	
	router.get('/appversion',  function(req, res) {
		var data = {
			"IEQ@type":req.query.type,
			"DORDER":"create_time",
			"iDisplay": 0,
			"iDislength": 1
		}
		client.get("/version/search", {
			condition:JSON.stringify(data)
		},function(err, rq, rs, data){
			res.send(data.aaData[0]);
		})
	});
	
	
}
