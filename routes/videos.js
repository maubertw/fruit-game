let express = require('express');
let router = express.Router();
const { Video } = require('../public/javascripts/video-class');



router.get('/:videoId.mp4/group-of-pictures.json', async function(req, res, next) {
  try {
    const video = new Video(req.params.videoId);
    res.send(video.json);
  } catch (e) {
    console.log('ERROR IN GET JSON, ', e)
    next();
  }
});


router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', (req, res, next) => { 
  try {
    const video = new Video(req.params.videoName);
    video.getSingleGop(+req.params.groupIndex, res);
  } catch (e) {
    console.log('ERROR IN GET CLIP: ', e);
    next();
  }
});


router.get('/:videoName.mp4/group-of-pictures', (req, res, next) => {
  try {
    const video = new Video(req.params.videoName);
    const inspectorData = video.getInspectorData();
    res.render('videos', {
      inspectorData
    })
  } catch (e) {
    console.log('ERROR IN GET ALL GOP, ', e);
    next();
  }
});


module.exports = router;










