const { exec, execSync } = require('child_process');

const filterIFrames = (data) => {
    const iFrames = [];
    for(let d in data) {
        if(data[d].pict_type === 'I') {
            console.log('hi!')
            iFrames.push(data[d]);
        }
    }
    return iFrames;
}

const getBestEffortTimestampTime = (iFrames, startIndex) => {
    return iFrames[startIndex].best_effort_timestamp_time;
}


module.exports = { 
    filterIFrames,
    getBestEffortTimestampTime,
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
    