let express = require('express');
let router = express.Router();
const { exec } = require('child_process');

// Refrence only
  // res.render('videos', { 
  //   source: '', 
  //   msg: 'Mary and her coding',
  //   values: ['hello', 'world', 'heeeeeeeyyyy!!!', 'zomsfhivn'],
  // });


router.get('/', function(req, res, next) {
  res.send('Nothing here either');
});

router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
  const command = 'ffmpeg -i CoolVideo.mp4 -acodec copy -f segment -vcodec copy -reset_timestamps 1 -map 0 OUTPUT%d.mp4'
})

router.get('/:videoId.mp4/group-of-pictures.json', function(req, res, next) {
  const params = req.params
  const command = `"ffprobe" -show_frames -print_format json ./public/images/${params.videoId + '.mp4'}`
  exec(
    command, 
    {maxBuffer: 10240 * 5000}, 
    (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
      }
      const data = JSON.parse(stdout.toString())['frames']
      const iFrames = []
      for(let d in data) {
        if(data[d].pict_type == "I") {
          iFrames.push(data[d])
        }
      }
      res.send(iFrames)
  });
});



module.exports = router;
