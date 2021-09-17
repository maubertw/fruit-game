let express = require('express');
let router = express.Router();
const { exec } = require('child_process');
const utilFunctions = require('../public/javascripts/utils');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


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
  
  
  // get the clip - add back
  // const start = iFrames[frame].best_effort_timestamp_time
  // const end = iFrames[frame+1].best_effort_timestamp_time
  // -ss 00:10.667969 -to 00:14.667969

  // res.setHeader('Content-Type', 'video/mp4')

// const outputResponse(data) {

// }

router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', async function(req, res, next) {
  try {
    // res.on('end', () => {
    //   console.log('response ', res)
    // })
    // res.contentType = 'video/mp4';
    // https://stackoverflow.com/questions/32083522/how-view-mime-type-in-chrome-its-showing-document-under-network-tab
    // RE THIS RESPONSE IS JUST A DOCUMENT, HAVE TO MAKE IT A PAGE I GUESS?
    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Content-Disposition', 'attachment')
    const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
    ffmpeg(readStream)
    .setStartTime('00:10.667969')
    .setDuration('00:14.667969')
    .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
    .format('mp4')
    .pipe(res, {end: true});   
  } catch(e) {
    console.log('there was an error getting your clip ', e)
    next(e);
  }    
});

const sendMp4 = (data, response) => {

}


// GET All GOP
router.get('/:videoName.mp4/group-of-pictures', function(req, res, next) {
  const command = 'ffmpeg -i CoolVideo.mp4 -acodec copy -f segment -vcodec copy -reset_timestamps 1 -map 0 OUTPUT%d.mp4'
  console.log('command', command)
})


router.get('/', function(req, res, next) {
  res.render('videos');
});


module.exports = router;
















