var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { 
//     title: 'Express', 
//     msg: 'Mary and her coding',
//     values: ['hello', 'world', 'heeeeeeeyyyy!!!', 'zomsfhivn'],
//   });
// });