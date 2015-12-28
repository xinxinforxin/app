var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function(router) {

    router.get('/faq', function(req, res) {
        res.render('doc/faq');
    });
    router.get('/about', function(req, res) {
        res.render('doc/about');
    });
};