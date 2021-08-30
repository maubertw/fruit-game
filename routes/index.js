let express = require('express');
let router = express.Router();
const { exec } = require('child_process');
// const {ffprobe} = require('ffprobe');
// const path = require('path');
// const { stdout } = require('process');
// const probe = require('node-ffprobe')

// GET /videos/:videoId.mp4/group-of-pictures.json
// This endpoint should respond with JSON encoded data showing details of all the I frames in a video.


router.get('/', function(req, res, next) {
  exec(
    '"ffprobe" -show_frames -print_format json ./public/images/CoolVideo.mp4', 
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
      res.json(iFrames)
  });


});

module.exports = router;
