let express = require('express');
let router = express.Router();
const { Video } = require('../public/javascripts/video-class');



router.get('/:videoId.mp4/group-of-pictures.json', async function(req, res, next) {
  try {
    console.log('asdfasdfasdf', req.params.videoId)
    const video = new Video(req.params.videoId);
    res.send(video.json);
  } catch (e) {
    console.log('ERROR IN GET JSON, ', e)
  }
});


router.get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4', (req, res, next) => { 
  try {
    console.log('vid', req.params.videoName)
    const video = new Video(req.params.videoName);
    video.getSingleGop(+req.params.groupIndex, res);
  } catch (e) {
    console.log('ERROR IN GET CLIP: ', e)
  }
});


router.get('/:videoName.mp4/group-of-pictures', (req, res, next) => {
  try {
    const video = new Video(req.params.videoName);
    res.render('videos', {
      inspectorData: video.getInspectorData()
    })
  } catch (e) {
    console.log('ERROR IN GET ALL GOP, ', e)
  }
});


module.exports = router;










