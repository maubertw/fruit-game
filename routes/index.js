let express = require('express');
let router = express.Router();
const { execFile, spawn, spawnSync } = require('child_process');

/* GET home page. */
router.get('/', function(req, res, next) {
  const spawn = spawnSync('ffprobe' , ['../public/images/CoolVideo.mp4', '-show_frames', '-print_format json'],)
  console.log('data ', spawn.stdout)
  res.render('index', { 
    title: 'Express', 
    msg: 'Mary and her coding',
    values: ['hello', 'world', 'heeeeeeeyyyy!!!', 'zomsfhivn'],
  });
});

module.exports = router;
