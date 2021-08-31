let express = require('express');
let router = express.Router();


router.get('/', function(req, res, next) {
  res.send('this is the root page');
});


module.exports = router;
