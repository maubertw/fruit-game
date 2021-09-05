let express = require('express');
let router = express.Router();
const { exec } = require('child_process');
const utilFunctions = require('../public/javascripts/utils');



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

// this is writting a single file to disk so far from timestamp to timestamp
// router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', function(req, res, next) {
//   const command = `"ffprobe" -show_frames -print_format json ./public/images/${req.params.videoName + '.mp4'}`
//   exec(
//     command, 
//     {maxBuffer: 10240 * 5000},
//     utilFunctions.getChildProcessData 
//   )
//     // (error, stdout, stderr) => {
//     //   if (error) {
//     //       console.log(`error: ${error.message}`);
//     //   }
//     //   if (stderr) {
//     //       console.log(`stderr: ${stderr}`);
//     //   }

//     //   const data = JSON.parse(stdout.toString())['frames']
//     //   const iFrames = []
//     //   // TODO: GET THE CORRECT FILTERING METHOD TO REDUCE TIME/SPACE
//     //   for(let d in data) {
//     //     if(data[d].pict_type == "I") {
//     //       console.log('times ', data[d].best_effort_timestamp_time)
//     //       iFrames.push(data[d])
//     //     }
//     //   }
//       const frame = req.params.groupIndex
//       const start = iFrames[frame].best_effort_timestamp_time
//       const end = iFrames[frame+1].best_effort_timestamp_time

//       const frameCommand = `ffmpeg -ss ${"00:"+start} -to ${"00:"+end} -i ./public/images/CoolVideo.mp4 -c copy ./public/images/output6.mp4`
//       exec(frameCommand, 
//         {maxBuffer: 10240*5000},
//         (error, stdout, stderr) => {
//           if(error) {
//             console.log(`error ${error.message}`);
//           }
//           if(stderr) {
//             console.log(`stderr: ${stderr}`);
//           }
//           console.log('std out', stdout)
//         })
     
//       res.send(stdout)
//   });

// })

router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
  // Figure out how to serve these files to the client
  // figure out how to delete the files, or maybe send w/o generating?
  const command = 'ffmpeg -i CoolVideo.mp4 -acodec copy -f segment -vcodec copy -reset_timestamps 1 -map 0 OUTPUT%d.mp4'
  console.log('command', command)
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
      res.send(utilFunctions.filterIFrames(data));
  });
});



module.exports = router;






