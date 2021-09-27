//// WANT TO GET RID OF THIS CALL TO SAVE ROOM
// getDuration = () => {
//   const command = `"ffprobe" -of json -show_streams -show_format ${this.path}.mp4`
//   const process = execSync(
//       command,
//       {maxBuffer: 10240 * 5000},
//       (error, stdout, stderr) => {
//           if (error) {
//               console.log(`error: ${error.message}`);
//               }
//               if (stderr) {
//               console.log(`stderr: ${stderr}`);
//               }
//       });
//       const duration = JSON.parse(process.toString('utf8')).streams[0].duration;
//       return duration;   
// }






//////// old working routes

// GET JSON DATA
// change this into a method that can be used by the other ones
// router.get('/:videoId.mp4/group-of-pictures.json', async function(req, res, next) {
//   try {
//     res.send(utilFunctions.getIframeJson(req.params.videoId));
//   } catch (e) {
//     console.log('ERROR IN GET JSON, ', e)
//   }
// });



// SINGLE CLIP - need to test last and first video
// router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', (req, res, next) => { 
//   try {
//     const { start, end } = utilFunctions.getStartEndClip(+req.params.groupIndex, req.params.videoName);
//     const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
//     res.setHeader('Connection', 'Keep-Alive')
//     res.contentType('mp4')
//     ffmpeg(readStream)
//       .setStartTime(start)
//       .setDuration(end)
//       .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
//       .format('mp4')
//       .on('end', (data) => {
//         console.log('file written successfully')  
//       })
//       .on('error', (e) => {
//         console.log('err', e)
//       })
//       .pipe(res, {end: true})
//   } catch (e) {
//     console.log('ERROR IN GET CLIP: ', e)
//   }
// });

// router.get('/:videoName.mp4/group-of-pictures', (req, res, next) => {
//   try {
//    const inspectorData = utilFunctions.getInspectorData(req.params.videoName);
//     //console.log('DDDDDDDDDD', inspectorData)
//     res.setHeader('Connection', 'Keep-Alive')
//     res.render('videos', {
//     inspectorData
//     // nspectorData: ['val1', 'val2', 'val3']
//     });
//   } catch (e) {
//     console.log('ERROR IN GET ALL GOP, ', e)
//   }
// });










//- h1 GOPs!!! 





  // video(type="video/mp4", controls, src=clip.url)
  // p from #{clip.start} to #{clip.end}
// working get clip
// SINGLE CLIP
// router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', async function(req, res, next) {
//   const params = req.params
//   const command = `"ffprobe" -show_frames -print_format json ./public/images/${params.videoName + '.mp4'}`
//   exec(
//     command, 
//     {maxBuffer: 10240 * 5000}, 
//     (error, stdout, stderr) => {
//       if (error) {
//         console.log(`error: ${error.message}`);
//       }
//       if (stderr) {
//         console.log(`stderr: ${stderr}`);
//       }
//       const data = JSON.parse(stdout.toString())['frames']
//       const iFrames = utilFunctions.filterIFrames(data);
//       const lastFrame = iFrames.length;
//       // if the last frame is requested we need to go to the end which will be the end time stamp of the movie
//       if (params.groupIndex > lastFrame) {
//         res.send(`This video only has ${lastFrame} frames, your request is out of range`)
//         return;
//       }
//       const frame = +req.params.groupIndex
//       const { start, end } = utilFunctions.getStartEndClip(frame, )
//       // const start = iFrames[frame].best_effort_timestamp_time
//       // const end = iFrames[frame+1].best_effort_timestamp_time

//       // FROM HERE IS WHERE WE START THIS ROUTE
//       const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
//       res.contentType('mp4')
//       ffmpeg(readStream)
//         .setStartTime(start)
//         .setDuration(end)
//         .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
//         .format('mp4')
//         .on('end', (data) => {
//           console.log('file written successfully', data)
//         })
//         .on('error', function(e) {
//           console.log('there was an error ', e)
//         })
//         .pipe(res, {end: true}) 
//       }); 
// });







/// OLD UTILS

// const getIframeJson = (videoId) => {
//   const command = `"ffprobe" -show_frames -print_format json ./public/images/${videoId + '.mp4'}`
//   const process = execSync(
//       command, 
//       {maxBuffer: 10240 * 5000}, 
//       (error, stdout, stderr) => {
//         if (error) {
//           console.log(`error: ${error.message}`);
//         }
//         if (stderr) {
//           console.log(`stderr: ${stderr}`);
//         }
//       });
//     const json = JSON.parse(process.toString('utf8'))['frames'];
//     return utilFunctions.filterIFrames(json);
// };


// const filterIFrames = (data) => {
//   const iFrames = [];
//   for(let d in data) {
//       if(data[d].pict_type == 'I') {
//           iFrames.push(data[d]);
//       }
//   }
//   return iFrames;
// }








// for getting just iframes:
// https://superuser.com/questions/669716/how-to-extract-all-key-frames-from-a-video-clip


// GET All GOP
// router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
//   const command = 'ffmpeg -i CoolVideo.mp4 -acodec copy -f segment -vcodec copy -reset_timestamps 1 -map 0 OUTPUT%d.mp4'
//   console.log('command', command)
// })

// router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
//   const params = req.params
//   const command = `"ffprobe" -show_frames -print_format json ./public/images/CoolVideo.mp4`
//   exec(
//     command, 
//     {maxBuffer: 10240 * 5000}, 
//     (error, stdout, stderr) => {
//         if (error) {
//           console.log(`error: ${error.message}`);
//         }
//         if (stderr) {
//           console.log(`stderr: ${stderr}`);
//         }
//         const data = JSON.parse(stdout.toString())['frames']
        
//         const iFrames = utilFunctions.filterIFrames(data);
//         const lastFrame = iFrames.length;
//         // if the last frame is requested we need to go to the end which will be the end time stamp of the movie
//         if (params.groupIndex > lastFrame) {
//           res.send(`This video only has ${lastFrame} frames, your request is out of range`)
//           return;
//         }
//         const clips = []
//         for(let i = 0; i < 6; i++) {
//           // let clip = ''
//           // const name = `clip${i}`
//           const start = iFrames[i].best_effort_timestamp_time
//           const end = iFrames[i+1].best_effort_timestamp_time
//           const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
//           ffmpeg(readStream)
//           .setStartTime(start)
//           .setDuration(end)
//           .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
//           .format('mp4')
//           .on('data', function(chunk){
//             console.log('got some data', chunk)
//           })
//           .on('end', (data) => {
//             console.log('file written successfully', data)  
//             // clips.push(clip)
//           })
//           .on('error', function(e) {
//             console.log('there was an error ', e)
//           })
//           .on('pipe', function(src){
//             console.log('clips ', clips)
//             clips.push(src)
//           })
//           .pipe()
//         }
//         res.render(
//           'videos',
//           {clips}
//         )
//       })
// });

// router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
//   try {

//   //   const params = req.params
//   //   const count = 1
//   //   const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
//   //   const writeable = fs.createWriteStream({objectMode: true})
//   //       ffmpeg(readStream)
//   //         .addOutputOptions(`copy -f segment -vcodec copy`)
//   //         .format('mp4')
//   //         .on('error', function(e) {
//   //           console.log('there was an error ', e)
//   //         })
//   //         .on('data', function(data) {
//   //           console.log('got one ', data)
//   //         })
//   //         .on('end', function(data) {
//   //           console.log('data', data)
//   //           res.render('videos', {
//   //             clips: data
//   //           })
//   //         })
//   //         // .on('pipe', function(src) {
//   //         //    res.render('videos', {
//   //         //      clips: src
//   //         //    })
//   //         // })
//   //         .pipe()
//   // } catch(e) {
//   //   console.log('there was an error getting you clips ', e)
//   // }
//   //       // .pipe(res) 
// } catch(e) {
//   console.l
// }); 







// WORKING
// });
// try {
//   const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
//   res.contentType('mp4')
//   ffmpeg(readStream)
//     .setStartTime(start)
//     .setDuration(end)
//     .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
//     .format('mp4')
//     .on('end', (data) => {
//       console.log('file written successfully', data)
//     })
//     .on('error', function(e) {
//       console.log('there was an error ', e)
//     })
//     .pipe(res, {end: true})     
// } catch(e) {


// LAST WORKING PIPE FILE DIRECTLY TO RES
// const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
// ffmpeg(readStream)
// .setStartTime('00:10.667969')
// .setDuration('00:14.667969')
// .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
// .format('mp4')
// .pipe(res);   
// } catch(e) {
// console.log('there was an error getting your clip ', e)
// next(e);
// }   
  

    // res.on('end', () => {
    //   console.log('response ', res)
    // })
    // res.contentType = 'video/mp4';
    // https://stackoverflow.com/questions/32083522/how-view-mime-type-in-chrome-its-showing-document-under-network-tab
    // RE THIS RESPONSE IS JUST A DOCUMENT, HAVE TO MAKE IT A PAGE I GUESS?
//     const writer = getWritableStreamSomehow();
// const reader = getReadableStreamSomehow();
// writer.on('pipe', (src) => {
//   console.log('Something is piping into the writer.');
//   assert.equal(src, reader);
// });
// reader.pipe(writer);

// GET INTO THE EVENT CYCLE
    
    // res.on('pipe', (src) => {
    //   // console.log('source  ', src)
    //   res.setHeader('Content-Type', 'video/mp4')
    //   res.setHeader('Content-Disposition', 'attachment')
    //   res.attachment(src, 'clip4.mp4')
    //   res.send()
    // })
    // res.attachment()
  
  
  
  // TRY THIS NEXT!!!
  // https://stackoverflow.com/questions/33725893/how-do-you-use-node-js-to-stream-an-mp4-file-with-ffmpeg  
  
  
  // -movflags frag_keyframe: https://ffmpeg.org/ffmpeg-formats.html
// Start a new fragment at each video keyframe.
  
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
  // const command = `"ffprobe" -show_frames -print_format json ./public/images/${req.params.videoName + '.mp4'}`
  // // const jsonData = 
  // const test = exec(
  //   command, 
  //   {maxBuffer: 10240 * 5000},
  //   (error, stdout, stderr) => {
  //     if (error) {
  //         console.log(`error: ${error.message}`);
  //     }
  //     if (stderr) {
  //         console.log(`stderr: ${stderr}`);
  //     }
  //     // Parse data from stdout and filter for the iFrames
  //     const data = JSON.parse(stdout.toString())['frames'];
  //     const iFrames = utilFunctions.filterIFrames(data);
  //     // Get the desired index and grab the timestamps from it and the following frame
  //     const frame = parseInt(req.params.groupIndex);
  //     const start = utilFunctions.getBestEffortTimestampTime(iFrames, frame);
  //     const end = utilFunctions.getBestEffortTimestampTime(iFrames, frame+1);
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
 



// two helper string that I found: https://stackoverflow.com/questions/22908987/send-ffmpeg-segmented-files-to-remote-location
// ffmpeg -i CoolVideo.mp4 -map 0 -codec:v libx264 -codec:a mp4 -f segment -flags -global_header -segment_format mpegts -segment_time 10 "http://localhost/3000"segment%03d.ts

// https://stackoverflow.com/questions/33718810/ffmpeg-how-to-pass-http-headers
// ffmpeg -i CoolVideo.mp4 -movflags empty_moov -y -timeout 50000 -map 0:0 -an -sn -f mp4 -headers "User Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36" -headers "X-Forwarded-For: 24.148.85.30" http://localhost:3000/videos -v trace