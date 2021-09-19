let express = require('express');
let router = express.Router();
const { exec } = require('child_process');
const utilFunctions = require('../public/javascripts/utils');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { response } = require('express');


// GET JSON DATA
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
      res.send(utilFunctions.filterIFrames(data));
    });
  });
  

// SINGLE CLIP
router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', async function(req, res, next) {
  const params = req.params
  const command = `"ffprobe" -show_frames -print_format json ./public/images/${params.videoName + '.mp4'}`
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
      
      const iFrames = utilFunctions.filterIFrames(data);
      const lastFrame = iFrames.length;
      // if the last frame is requested we need to go to the end which will be the end time stamp of the movie
      if (params.groupIndex > lastFrame) {
        res.send(`This video only has ${lastFrame} frames, your request is out of range`)
        return;
      }
      const frame = +req.params.groupIndex
      const start = iFrames[frame].best_effort_timestamp_time
      const end = iFrames[frame+1].best_effort_timestamp_time
      const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
      res.contentType('mp4')
      ffmpeg(readStream)
        .setStartTime(start)
        .setDuration(end)
        .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
        .format('mp4')
        .on('end', (data) => {
          console.log('file written successfully', data)
        })
        .on('error', function(e) {
          console.log('there was an error ', e)
        })
        .pipe(res, {end: true}) 
      }); 
});


router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
  res.render('videos')
})





module.exports = router;
















