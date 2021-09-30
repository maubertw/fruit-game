const { execSync } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');


class Video {
    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name; // name of the video without the path or file extention
        this.path = './public/images/' + this.name;
        // we need this data to run the other operations, so we want to have it 
        // available as soon as we instantiate the class
        this.iframeJson = this.getIframeJson(); 
    }

    get json() { 
        return this.iframeJson;
    }

    getIframeJson = () => {
        // ffprobe command to get video metadata in json format
        const command = `"ffprobe" -show_frames -print_format json ${this.path}.mp4`
        // run the command as a child process
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
            // parse the output buffer and select the frames property
            const json = JSON.parse(process.toString('utf8'))['frames'];
          // only return the data for the iFrames  
          return this.filterIFrames(json);
    }

 
    getSingleGop = async (index, writeStream) => { 
        /**
         * @param {number} index
         * @param {Response} writeStream
         */
        try {
            const { start, end } = this.getStartEndGop(index);
            // create a readable stream of the video file to pass to the command
            const readStream = await fs.createReadStream(this.path + '.mp4');
            // keep the connection alive to account for longer response times
            writeStream.setHeader('Connection', 'Keep-Alive');
            // set the correct mime type so the client knows what to do with the response object
            writeStream.contentType('mp4');
            ffmpeg(readStream)
              .setStartTime(start)
              .setDuration(end)
              // move the metadata to the front of the file so that it is streamable
              .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
              .format('mp4')
              .on('end', (data) => {
                console.log('file written successfully')  
              })
              .on('stderr', (err) => {
                  console.log('there was some kind of error', err)
              })
              .on('error', (e) => {
                console.log('THERE WAS AN ERROR GETTING SINGLE CLIP', e)
              })
              // pipe the output data directly on the write stream and send the response
              .pipe(writeStream, {end: true})
        } catch (e) {
            console.log('get single gop process failed ', e)
        }
    }

    getInspectorData = () => {
        // use the iframe json to get the inspector view data and build the GOP urls for the playable clips
        return this.iframeJson.map((frame, i) => {
            const { start, end } = this.getStartEndGop(i);
            const url = `http://localhost:3000/videos/${this.name}.mp4/group-of-pictures/${i}.mp4`
            return { start, end, url };
        });
    }    

    filterIFrames = (data) => {
        /**
         * @param {JSON} data
         */
        const iFrames = [];
        for(let j in data) {
            if(data[j].pict_type == 'I') {
                iFrames.push(data[j]);
            }
        }
        return iFrames;
    }
        
    getStartEndGop = (frameIndex) => {
        /**
         * @param {number} frameIndex
         */
        if(frameIndex > this.iframeJson.length-1) {
            return `The frame you requested is out of range, your selection must be between 0 and  ${this.iframeJson.length-1}`
        }
        const groupData = this.iframeJson[frameIndex];
        const start = groupData.best_effort_timestamp_time;
        const end = +start + 3//+groupData.pkt_duration_time;
        return { start, end };
    }


}


module.exports = { 
    Video,
}
