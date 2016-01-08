var client = require('util-restify');
var async = require('async');
var oauth = require('../../lib/oauth');
var moment = require('moment');
var valid = require('../../lib/validate');
var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function(router){
	//定期/项目已投资详情
	router.get('/detail/:id', oauth.authorise(), function(req, res){

		var t = valid(req.params, ['id'], res);
		if(!t){
			return false;
		}
		var data = {
			"investId": req.params.id,
			"userId": req.user.id
		}
		logger.trace('定期/项目已投资详情 接收参数为------>', data);
		var condition = JSON.stringify(data);
		client.get('/commonquery/querywithargs/investedDetail', {
			condition: condition
		}, function(er, rq, rs, result){
			logger.trace('定期/项目已投资详情 返回数据result为------>', result);
			res.send(result);
		});
	});

	//活期已投资详情
	
	router.get('/hqDetail/:id', oauth.authorise(), function(req, res) {
		var t = valid(req.params, ['id'], res);
		if(!t){
			return false;
		}
		var data = {
			"investId": req.params.id,
			"userId": req.user.id
		}
		logger.trace('活期已投资详情 接收参数为------>', data);
		var condition = JSON.stringify(data);
		client.get('/commonquery/querywithargs/hqInvestedDetail', {
			condition: condition
		}, function(er, rq, rs, result){
			logger.trace('活期已投资详情 返回数据data为------>', result[0]);
			//活期已投资的详情，查询到的记录都属于同一个invest_id的内容
			//计算累计收益，各个记录的origin_profit，vip_profit，ticket_profit相加

			if(result[0] == undefined){
				logger.trace("#####  返回数据data为undefined");
				return;
			}

			var profit = 0;
			for(var i = 0; i<result.length; i++){
				if(!result[i].originProfit){
					break;
				}
				profit = parseFloat(result[i].originProfit) + parseFloat(result[i].vipProfit) + parseFloat(result[i].ticketProfit) + profit;
			} 
			if(!result[0].originProfit){
				//昨日收益
				result[0]['lastProfit'] = 0;
			}else{
				result[0]['lastProfit'] = parseFloat(result[0].originProfit) + parseFloat(result[0].vipProfit) + parseFloat(result[0].ticketProfit);
			}
			//总收益
			result[0]['profit'] = profit;

			if(result[0].status == 0 || result[0].status == 20){ //活期 在途或者部分赎回，多加一个字段，显示利率
				var curDate = moment().format('YYYY-MM-DD');//当前时间
				var createDate = result[0]['createTime'].substr(0,10);//购买产品时间

				var day = moment(curDate).diff(moment(createDate), 'days') +1;
				result[0]['record_counter'] = day;
				console.info("*********",day);
				if(parseFloat(result[0]['curRate']) >= 12){//大于等于12，就不会再增加利率
					result[0]['rate'] = parseFloat(result[0]['curRate']);
				}else{
					result[0]['rate'] = parseFloat(result[0]['curRate']) + parseInt(day/30)*0.5;//活期每30天加0.5%的利率
				}
				
			}
			logger.trace('活期已投资详情 返回数据data为------>', result[0]);
			res.send(result[0]);
		});
	});

	//invest分页 
	router.get('/myInvest', oauth.authorise(), function(req, res) {
		 var condition = {
			"userId":req.user.id,
			"pageIndex": req.query.pageIndex -1,
			"pageSize": req.query.pageSize
		}
		logger.trace('myInvest:', condition);
		client.get("/commonquery/querywithargs/investedList",{
			condition:JSON.stringify(condition)
		}, function(err, rq, rs, data){
			logger.trace('myInvest back:', data);
			for(var i = 0; i<data.length; i++){
				if(data[i].cycle == 0 && (data[i].status == 0 || data[i].status == 20)){ //活期在途或者部分赎回，多加一个字段，显示利率
					var curDate = moment().format('YYYY-MM-DD');//当前时间
					var createDate = data[i]['createTime'].substr(0,10);//购买产品时间

					var day = moment(curDate).diff(moment(createDate), 'days') +1;

					if(parseInt(data[i]['curRate']) >= 12){//大于等于12，就不会再增加利率
						data[i]['cur_rate'] = parseInt(data[i]['curRate']);
					}else{
						data[i]['cur_rate'] = parseInt(data[i]['curRate']) + parseInt(day/30*0.5);//活期每30天加0.5%的利率
					}
				}
			}
			res.send(data);
		})
	});

	

	//invest分页 ----之后会用，然后遗弃 myInvest
	router.get('/newInvest', oauth.authorise(), function(req, res) {


		// type: 1 表示 保理，新手  2 表示  活期，定期
		// status: 0 表示 在途， 1表示还款
		 var condition = {
			"userId":req.user.id,
			"type": req.query.type,
			"status": req.query.status,
			"pageIndex": req.query.pageIndex -1,
			"pageSize": req.query.pageSize
		}
		logger.trace('myInvest:', condition);
		client.get("/commonquery/querywithargs/investedList",{
			condition:JSON.stringify(condition)
		}, function(err, rq, rs, data){
			logger.trace('myInvest back:', data);
			if(req.query.type == '2'){
				for(var i = 0; i<data.length; i++){
					if(data[i].cycle == 0 && (data[i].status == 0 || data[i].status == 20)){ //活期在途或者部分赎回，多加一个字段，显示利率
						var curDate = moment().format('YYYY-MM-DD');//当前时间
						var createDate = data[i]['createTime'].substr(0,10);//购买产品时间

						var day = moment(curDate).diff(moment(createDate), 'days') +1;

 						data[i]['record_counter'] = day;

						if(parseInt(data[i]['curRate']) >= 12){//大于等于12，就不会再增加利率
							data[i]['cur_rate'] = parseInt(data[i]['curRate']);
						}else{
							data[i]['cur_rate'] = parseFloat(data[i]['curRate']) + parseInt(day/30)*0.5;//活期每30天加0.5%的利率
						}
					}else{
						var curDate = moment().format('YYYY-MM-DD');//当前时间
						var createDate = data[i]['createTime'].substr(0,10);//购买产品时间

						var day = moment(curDate).diff(moment(createDate), 'days') +1;

 						data[i]['record_counter'] = day; 
					}
				}
			}
			res.send(data);
		})
	});

	//用于协议生成
	
	router.get('/protocol', oauth.authorise(), function(req, res) {
		var t = valid(req.query, ['investId'], res);
		if(!t){
			return false;
		}
		var condition = {
			"investId": req.query.investId
		}	
		logger.trace('protocol:', condition);
		client.get("/commonquery/querywithargs/myProtocol",{
			condition:JSON.stringify(condition)
		}, function(err, rq, rs, data){
			logger.trace('protocol back:', data);
			res.send(data);
		})
	});
	
}
