let express = require('express');
let router = express.Router();
const { exec } = require('child_process');


router.get('/', function(req, res, next) {
  res.send('Nothing here either');
});

router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
  const params = req.params;
  res.send('this is vor the segments')
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
