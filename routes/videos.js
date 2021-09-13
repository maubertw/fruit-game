let express = require('express');
let router = express.Router();
const { exec } = require('child_process');
const utilFunctions = require('../public/javascripts/utils');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


// two helper string that I found: https://stackoverflow.com/questions/22908987/send-ffmpeg-segmented-files-to-remote-location
// ffmpeg -i CoolVideo.mp4 -map 0 -codec:v libx264 -codec:a mp4 -f segment -flags -global_header -segment_format mpegts -segment_time 10 "http://localhost/3000"segment%03d.ts

// https://stackoverflow.com/questions/33718810/ffmpeg-how-to-pass-http-headers
// ffmpeg -i CoolVideo.mp4 -movflags empty_moov -y -timeout 50000 -map 0:0 -an -sn -f mp4 -headers "User Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36" -headers "X-Forwarded-For: 24.148.85.30" http://localhost:3000/videos -v trace

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
  

  // notes:
  // see if we can pipe the output into another ffmpeg process or pipe to stdin
  
  // TRY THIS NEXT!!!
  // https://stackoverflow.com/questions/33725893/how-do-you-use-node-js-to-stream-an-mp4-file-with-ffmpeg



 // -ss 00:10.667969 -to 00:14.667969

router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', async function(req, res, next) {
  try {
    res.contentType = 'video/mp4'
    const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
    ffmpeg(readStream)
    .setStartTime('00:10.667969')
    .setDuration('00:14.667969')
    .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
    .format('mp4')
    .pipe(res);   
  } catch(e) {
    console.log('there was an error getting your clip ', e)
    next(e);
  }    
});


// GET All GOP
// -movflags frag_keyframe: https://ffmpeg.org/ffmpeg-formats.html
// Start a new fragment at each video keyframe.
router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
  // Figure out how to serve these files to the client
  // figure out how to delete the files, or maybe send w/o generating?
  const command = 'ffmpeg -i CoolVideo.mp4 -acodec copy -f segment -vcodec copy -reset_timestamps 1 -map 0 OUTPUT%d.mp4'
  console.log('command', command)
})

module.exports = router;

  // OLD WIP
  // router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', async function(req, res, next) {
  //       const execP = util.promisify(require('child_process').exec);
  //       try {
  //         const frameCommand = `ffmpeg -ss 00:10.667969 -to 00:14.667969 -i ./public/images/CoolVideo.mp4 -movflags qcfaststart -movflags empty_moov -c copy -f mp4 pipe:1`
  //         res.contentType('video/mp4')
  //         const clip_command = await exec(
  //           frameCommand, 
  //           {maxBuffer: 10240*50000},
  //           (error, stdout, stderr) => {
  //             if(error) {
  //               console.log(`error ${error.message}`);
  //             }
  //             if(stderr) {
  //               console.log(`stderr: ${stderr}`);
  //             }
  //             return stdout
  //           })
  //           clip_command.stdout.on('data', (data) => {
  //             console.log(`stdout: `);
  //           });
            
  //           clip_command.stderr.on('data', (data) => {
  //             // console.error(`stderr: ${data}`);
  //           });
            
  //           clip_command.on('close', (code) => {
  //             console.log(`child process exited with code ${code}`);
  //           });
  //       } catch(e) {
  //         console.log('there was an error getting your clip ', e)
  //         next(e);
  //       }    
  // });







// GET ONE GOP  - SAVE FOR LATER
// router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', function(req, res, next) {
//   // TODO:
//   // SEND TO CORRECT PAGE
//   // DONT WRITE TO DISk

//   // this is writting a single file to disk so far from timestamp to timestamp
//   const command = `"ffprobe" -show_frames -print_format json ./public/images/${req.params.videoName + '.mp4'}`
//   // const jsonData = 
//   const test = exec(
//     command, 
//     {maxBuffer: 10240 * 5000},
//     (error, stdout, stderr) => {
//       if (error) {
//           console.log(`error: ${error.message}`);
//       }
//       if (stderr) {
//           console.log(`stderr: ${stderr}`);
//       }
//       // Parse data from stdout and filter for the iFrames
//       const data = JSON.parse(stdout.toString())['frames'];
//       const iFrames = utilFunctions.filterIFrames(data);
//       // Get the desired index and grab the timestamps from it and the following frame
//       const frame = parseInt(req.params.groupIndex);
//       const start = utilFunctions.getBestEffortTimestampTime(iFrames, frame);
//       const end = utilFunctions.getBestEffortTimestampTime(iFrames, frame+1);
//       //// THE GOOD ONE BELOW \\\\\\\
//       const frameCommand = `ffmpeg -ss ${"00:"+start} -to ${"00:"+end} -i ./public/images/CoolVideo.mp4 -movflags qcfaststart -movflags empty_moov -c copy -f mp4 pipe:`
      
//       console.log('coommmand ', frameCommand)
//       const promise = util.promisify(exec(
//         frameCommand, 
//         {maxBuffer: 1024*50000},
//         (error, stdout, stderr) => {
//           if(error) {
//             console.log(`error ${error.message}`);
//           }
//           if(stderr) {
//             console.log(`stderr: ${stderr}`);
//           }
//           return stdout
//         }));
//       promise.then((data) => {
//         console.log('got child promise ', data)
//         res.write(data)
//         res.contentType('video/mp4')
//         res.send()
//       })
//   });
//   // let file = null
//   // test.stdout.on('data', (data) => {
//   //   console.log('data', data)
//   //   res.write(data)
//   //   res.contentType('video/mp4')
//   //   res.send()
//   // })
// });


// THOUGHTS:
// NEED TO GET THE RETURN VALUE FROM THE CHILD PROCESS
// OR
// GET THE CHUNKED DATA TO WRITE


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { 
//     title: 'Express', 
//     msg: 'Mary and her coding',
//     values: ['hello', 'world', 'heeeeeeeyyyy!!!', 'zomsfhivn'],
//   });
// });
  





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






