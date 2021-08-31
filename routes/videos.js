let express = require('express');
let router = express.Router();
const { exec } = require('child_process');





router.get('/:videoId/group-of-picures.json', function(req, res, next) {
  // const command = `"ffprobe" -show_frames -print_format json ./public/images/${videoId}`
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Nothing here either');
});

module.exports = router;
