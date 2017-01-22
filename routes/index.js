var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Simon Game',
        description: 'Simon game from the 80s built on JavaScript, CSS, and HTML. A Free Code Camp project.'
    });
});

module.exports = router;
