const { execSync } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');


class Video {
    constructor(name) {
        this.name = name;
        this.path = './public/images/' + this.name;
        this.iframeJson = this.getIframeJson();
    }


    get json() { 
        return this.iframeJson;
    }


    getIframeJson = () => {
        const command = `"ffprobe" -show_frames -print_format json ${this.path}.mp4`
        const process = execSync(
            command, 
            {maxBuffer: 10240 * 50000}, 
            (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
              }
            });
          const json = JSON.parse(process.toString('utf8'))['frames'];
          return filterIFrames(json);
    }


    getSingleGop = (index, writeStream) => {
        const { start, end } = this.getStartEndClip(index);
        const readStream = fs.createReadStream(this.path);
        writeStream.setHeader('Connection', 'Keep-Alive')
        writeStream.contentType('mp4')
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
          .pipe(writeStream, {end: true})
    }


    getInspectorData = () => {
            const videoData = getIframeJson(this.name);
            const length = videoData.length;
            return packets = videoData.map((frame, i) => {
                const { start, end } = getStartEndClip(i, this.name);
                const url = `http://localhost:3000/videos/${this.name}.mp4/group-of-pictures/${i}.mp4`
                return { start, end, url };
            });
    }    


    filterIFrames = () => {
            const iFrames = [];
            for(let j in this.iframeJson) {
                if(this.iframeJson[j].pict_type == 'I') {
                    iFrames.push(this.iframeJson[j]);
                }
            }
            return iFrames;
    }
        

    getGopDuration = () => {
            const command = `"ffprobe" -of json -show_streams -show_format ${this.path}`
            const process = execSync(
                command,
                {maxBuffer: 10240 * 5000},
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        }
                        if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        }
                });
                const duration = JSON.parse(process.toString('utf8')).streams[0].duration;
                return duration;   
    }
        
        
    getStartEndGop = (frameIndex) => { // start and end timestamp
            let isLastFrame = false;
            if(frameIndex > this.iframeJson.length-1) {
                return `The frame you requested is out of range, your selection must be between 0 and  ${this.iframeJson.length-1}`
            }
            if (frameIndex === this.iframeJson.length-1) {
                isLastFrame = true;
            }
            const start = this.iframeJson[frameIndex].best_effort_timestamp_time;
            const end = isLastFrame ? this.getDuration() : this.iframeJson[frameIndex+1].best_effort_timestamp_time;
            
            return { start, end };
    }

}



















///////////////LEGACY//////////////////////////////

const getIframeJson = (fileName) => {
        const command = `"ffprobe" -show_frames -print_format json ./public/images/${fileName}.mp4`
        const process = execSync(
            command, 
            {maxBuffer: 10240 * 50000}, 
            (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
              }
            });
          const json = JSON.parse(process.toString('utf8'))['frames'];
          return filterIFrames(json);
};


const getStartEndClip = (frameIndex, videoName) => { // start and end timestamp
    let isLastFrame = false;
    const frameData = getIframeJson(videoName);
    if(frameIndex > frameData.length-1) {
        return `The frame you requested is out of range, your selection must be between 0 and  ${frameData.length-1}`
    }
    if (frameIndex === frameData.length-1) {
        isLastFrame = true;
    }
    const start = frameData[frameIndex].best_effort_timestamp_time;
    const end = isLastFrame ? getDuration() : frameData[frameIndex+1].best_effort_timestamp_time;
    
    return { start, end };
}


const getDuration = () => {
    const command = `"ffprobe" -of json -show_streams -show_format ./public/images/CoolVideo.mp4`
    const process = execSync(
        command,
        {maxBuffer: 10240 * 5000},
        (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                }
                if (stderr) {
                console.log(`stderr: ${stderr}`);
                }
        });
        const duration = JSON.parse(process.toString('utf8')).streams[0].duration;
        return duration;   
}


const getBestEffortTimestampTime = (iFrames, startIndex) => {
    return iFrames[startIndex].best_effort_timestamp_time;
}


const isFrameOutOfRange = (frameIndex, videoData) => {
    let isOutOfRange = false;
    if (frameIndex < 0 || frameIndex > videoData.length-1) { 
        isOutOfRange = true;
    } 
    return isOutOfRange;
}

const getInspectorData = (videoName) => {
    const videoData = getIframeJson(videoName);
    const length = videoData.length;
    return packets = videoData.map((frame, i) => {
        const { start, end } = getStartEndClip(i, videoName);
        const url = `http://localhost:3000/videos/${videoName}.mp4/group-of-pictures/${i}.mp4`
        return { start, end, url };
    });
}

const filterIFrames = (iframeJson) => {
    const iFrames = [];
    for(let j in iframeJson) {
        if(iframeJson[j].pict_type == 'I') {
            iFrames.push(iframeJson[j]);
        }
    }
    return iFrames;
}


module.exports = { 
    Video,
    filterIFrames,
    getBestEffortTimestampTime,
    getDuration,
    getStartEndClip,
    getIframeJson,
    getInspectorData,
}















































// COME BACK TO THESE AND FIGURE OUT THE PROMISE BUFFER SITUATION
// Print any errors, and gets JSON parsed stdout or null if it can't be parsed
// const getChildProcessData = (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//     }
//     try {
//         return JSON.parse(stdout)['frames'];
//     } catch(error) {
//         console.log('There was an error processing stout: ', error);
//         return null;
//     }
// }
    
// Strip the IFrames from the stdout of getChildProcessData
    

// const getIFramesJSON = async (videoName) => {
//     const command = `"ffprobe" -show_frames -print_format json ./public/images/${videoName + '.mp4'}`;
//     const frameData = await execSync(
//         command,
//         { maxBuffer: 10240 * 5000 },
//         getChildProcessData,
//     );
//     try {
//         return filterIFrames(frameData);
//     } catch(e) {
//         console.log('There was an error while getting iFrame data: ', e);
//         return null;
//     }
// }
    
// const getGop = () => {

// }

// // Get MP4 of one timestamp to the other
// const getClip = (index) => {

// }
    