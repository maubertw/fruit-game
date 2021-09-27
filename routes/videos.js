let express = require('express');
let router = express.Router();
const utilFunctions = require('../public/javascripts/video-class.js');
const { Video } = require('../public/javascripts/video-class');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');




// router.get('/:videoId.mp4/group-of-pictures.json', async function(req, res, next) {
//   try {
//     const video = new Video(req.params.videoId);
//     res.send(video.json);
//   } catch (e) {
//     console.log('ERROR IN GET JSON, ', e)
//   }
// });

router.get('/:videoId.mp4/group-of-pictures.json', async function(req, res, next) {
  try {
    res.send(utilFunctions.getIframeJson(req.params.videoId));
  } catch (e) {
    console.log('ERROR IN GET JSON, ', e)
  }
});
  

// SINGLE CLIP - need to test last and first video
router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', (req, res, next) => { 
  try {
    const { start, end } = utilFunctions.getStartEndClip(+req.params.groupIndex, req.params.videoName);
    const readStream = fs.createReadStream("./public/images/CoolVideo.mp4");
    res.setHeader('Connection', 'Keep-Alive')
    res.contentType('mp4')
    ffmpeg(readStream)
      .setStartTime(start)
      .setDuration(end)
      .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
      .format('mp4')
      .on('end', (data) => {
        console.log('file written successfully')  
      })
      .on('error', (e) => {
        console.log('err', e)
      })
      .pipe(res, {end: true})
  } catch (e) {
    console.log('ERROR IN GET CLIP: ', e)
  }
});


router.get('/:videoName.mp4/group-of-pictures', (req, res, next) => {
  try {
   const inspectorData = utilFunctions.getInspectorData(req.params.videoName);
    //console.log('DDDDDDDDDD', inspectorData)
    res.setHeader('Connection', 'Keep-Alive')
    res.render('videos', {
    inspectorData
    // nspectorData: ['val1', 'val2', 'val3']
    });
  } catch (e) {
    console.log('ERROR IN GET ALL GOP, ', e)
  }
});


module.exports = router;


// 

// each value in inspectorData
//   value.url











