var filter = require('util-format');
var mongo = require('./mongo');

var log4js = require('log4js');

var rest = require('util-restify');
var ejs = require('ejs');
var sms = require('util-sms');

for (var k in filter) {
	ejs.filters[k] = filter[k];
}

module.exports = function spec() {

	return {
		onconfig: function(config, next) {
			console.info(config._store.middleware.oauth);
			sms.init('fd6b741b891ca6e42380babe13495626', {
               'zc': '【椰子理财】感谢您注册椰子理财，您的验证码是{code}，为了您的资金安全，打死也不要告诉别人。',
               'findLoginPwd':'【椰子理财】正在找回登陆密码，您的验证码是{code}，请尽快验证',
               'findPayPwd':'【椰子理财】正在找回交易密码，您的验证码是{code}，请尽快验证',
               'addBank':'【椰子理财】您正在绑定银行卡，您的验证码是{code}(银联网络)，请尽快验证。',
               'reset_pay_pwd':'【椰子理财】正在重置交易密码，您的验证码是{code}，如果不是本人操作，请您致电客服400-024-3999',
               'reset_login_pwd':'【椰子理财】正在重置登录密码，您的验证码是{code}，如果不是本人操作，请您致电客服400-024-3999',
               'bindCard':'【椰子理财】亲爱的{name}您好，您于{TIME}成功绑定尾号为{NUMBER}的银行卡。若非本人操作，请您致电客服400-024-3999',
               'cz':'【椰子理财】亲，你在椰子理财成功转入{money}元。如果不是本人操作，请您致电客服400-024-3999',
               'dz':'【椰子理财】亲爱的{NAME}，您投资的{PRODUCTNAME}项目，本期利息{MONEY}元已到账。可以直接登录APP查看。',
               'tx':'【椰子理财】亲，你发起一笔提现（金额{money}元）申请已提交成功，预计2个工作日内到账。如果不是本人操作，请您致电客服400-024-3999'
            });
			rest.init(config.get('restify'));
			// log.config(config.get('tracerConfig'));
			log4js.configure(config.get('log4jsConfig'), {});
			console.info('s')
			mongo.config(config.get('mongoConfig'));
			next(null, config);
		}
	};
};