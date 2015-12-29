var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function(router) {

    router.get('/faq', function(req, res) {
        res.render('doc/faq');
    });
    router.get('/about', function(req, res) {
        res.render('doc/about');
    });
    router.get('/dd', function(req, res) {
        res.render('error/500');
    });
    router.get('/agreement/1', function(req, res) {
        res.render('doc/agreement-1');
    });
    router.get('/agreement/2', function(req, res) {
        res.render('doc/agreement-service');
    });
    router.get('/agreement/10', function(req, res) {
        res.render('doc/agreement-10');
    });
};