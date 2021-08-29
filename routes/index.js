var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express', 
    msg: 'Mary and her coding',
    values: ['hello', 'world', 'heeeeeeeyyyy!!!', 'zomsfhivn'],
  });
});

module.exports = router;
