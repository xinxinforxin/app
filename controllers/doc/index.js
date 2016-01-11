var log4js = require('log4js');
var logger = log4js.getLogger();
var client = require('util-restify');
var oauth = require('../../lib/oauth');
var valid = require('../../lib/validate');

module.exports = function(router) {

    router.get('/faq', function(req, res) {
        res.render('doc/faq');
    });
    router.get('/about', function(req, res) {
        res.render('doc/about');
    });
    router.get('/agreement/1', function(req, res) {
        res.render('doc/agreement-1');
    });
    router.get('/agreement/2', function(req, res) {
        res.render('doc/agreement-service');
    });
    router.get('/agreement/10', oauth.authorise(), function(req, res) {
        if(!req.query.investId){
            return res.render("doc/agreement-10",{ data: {productSaleAmount: '300000',
                curRate: '10.00000',
                userIc: '120101198712017237',
                borrower: '{"name": "test"}',
                userName: '陶治山',
                endDate: '2016-03-31',
                investCreateTime: '2016-01-05 13:35:14',
                investAmount: '100',
                mobile: '10000001000',
                rate: '10.0000' }});
        }else{
            var t = valid(req.query, ['investId','rate','access_token'], res);
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
                if(data.length == 0)
                    return res.send("404");
                data[0].rate = req.query.rate;
                logger.trace('protocol back:', data[0]);
                res.render('doc/agreement-10',{data: data[0]});
            })
        }
    });
    router.get('/test', function(req, res) {
        res.render('doc/test');
    });
    router.get('/list/mobile',function(req, res){
        var type = req.query.type || 60;
        var data = {};
        if(type){
            data['IEQ@type'] = type;
        }
        data['iDisplay'] = req.query.start/req.query.length;
        data['iDislength'] = req.query.length;
        var condition = JSON.stringify(data);
        logger.trace('doc app首页轮播图查询条件-->', condition);
        client.get('/doc/search', {
            condition: condition
        }, function(er, rq, rs, result){
            console.info(result);
            var _data ={//返回数据
                aaData: result.aaData,
                iTotalDisplayRecords: result.iTotalDisplayRecords,
                iTotalRecords: result.iTotalRecords
            }
            logger.trace('doc app首页轮播图返回数据-->', _data);
            res.send(_data);
        });
    });

};