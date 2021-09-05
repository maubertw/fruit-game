let express = require('express');
let router = express.Router();
const { exec } = require('child_process');
const utilFunctions = require('../public/javascripts/utils');


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
  
  
// GET ONE GOP  
router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', function(req, res, next) {
  // this is writting a single file to disk so far from timestamp to timestamp
  const command = `"ffprobe" -show_frames -print_format json ./public/images/${req.params.videoName + '.mp4'}`
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
      // Parse data from stdout and filter for the iFrames
      const data = JSON.parse(stdout.toString())['frames'];
      const iFrames = utilFunctions.filterIFrames(data);
      // Get the desired index and grab the timestamps from it and the following frame
      const frame = req.params.groupIndex;
      const start = utilFunctions.getBestEffortTimestampTime(iFrames, frame);
      const end = utilFunctions.getBestEffortTimestampTime(iFrames, frame+1);
      // Build and execute the command to get the json
      const frameCommand = `ffmpeg -ss ${"00:"+start} -to ${"00:"+end} -i ./public/images/CoolVideo.mp4 -c copy ./public/images/output6.mp4`
      exec(
        frameCommand, 
        {maxBuffer: 10240*5000},
        (error, stdout, stderr) => {
          if(error) {
            console.log(`error ${error.message}`);
          }
          if(stderr) {
            console.log(`stderr: ${stderr}`);
          }
          console.log('std out', stdout)
          res.send(stdout)
        });
  });
});

  
// GET All GOP
router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
  // Figure out how to serve these files to the client
  // figure out how to delete the files, or maybe send w/o generating?
  const command = 'ffmpeg -i CoolVideo.mp4 -acodec copy -f segment -vcodec copy -reset_timestamps 1 -map 0 OUTPUT%d.mp4'
  console.log('command', command)
})

module.exports = router;




/// come back to all of this
// Refrence only
  // res.render('videos', { 
  //   source: '', 
  //   msg: 'Mary and her coding',
  //   values: ['hello', 'world', 'heeeeeeeyyyy!!!', 'zomsfhivn'],
  // });

  // working getting all frames and rendering
  // ffmpeg -i CoolVideo.mp4 -acodec copy -f segment -vcodec copy -reset_timestamps 1 -map 0 OUTPUT%d.mp4

  //working for splitting from timestamp
  // ffmpeg -ss 00:00:30.0 -i CoolVideo.mp4 -c copy -t 00:00:10.0 output.mp4

  // working for writting to and from a certain place in the video
// ffmpeg -ss 00:40.000 -to 00:45.000 -i CoolVideo.mp4 -c copy something2.mp4

//const command = 'ffmpeg -ss 00:00.000 -to 00:11.000 -i CoolVideo.mp4 -acodec copy -f segment -vcodec copy -reset_timestamps 1 -map 0 OUTPUT%d.mp4'

router.get('/', function(req, res, next) {
  res.render('videos');
});








// const start = iFrames[frame].best_effort_timestamp_time
// const end = iFrames[frame+1].best_effort_timestamp_time






