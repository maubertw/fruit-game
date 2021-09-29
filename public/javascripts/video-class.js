const { execSync } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');


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

          return this.filterIFrames(json);
    }

    getSingleGop = async (index, writeStream) => {
        try {
            const { start, end } = this.getStartEndGop(index);
            const readStream = await fs.createReadStream(this.path + '.mp4');
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
              .on('stderr', (err) => {
                  console.log('there was some kind of error', err)
              })
              .on('error', (e) => {
                console.log('THERE WAS AN ERROR GETTING SINGLE CLIP', e)
              })
              .pipe(writeStream, {end: true})
        } catch (e) {
            console.log('get single gop process failed ', e)
        }
    }

    getInspectorData = () => {
        const videoData = this.iframeJson;
        return videoData.map((frame, i) => {
            const { start, end } = this.getStartEndGop(i);
            const url = `http://localhost:3000/videos/${this.name}.mp4/group-of-pictures/${i}.mp4`
            return { start, end, url };
        });
    }    

    filterIFrames = (data) => {
        const iFrames = [];
        for(let j in data) {
            if(data[j].pict_type == 'I') {
                iFrames.push(data[j]);
            }
        }
        return iFrames;
    }
        
    getStartEndGop = (frameIndex) => { // start and end timestamp
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
