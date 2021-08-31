let express = require('express');
let router = express.Router();
const { exec } = require('child_process');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Nothing here either');
});

router.get('/CoolVideo.mp4/group-of-pictures.json', function(req, res, next) {
  console.log('here')

  const params = req.params
  const command = `"ffprobe" -show_frames -print_format json ./public/images/${"CoolVideo.mp4"}`
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
