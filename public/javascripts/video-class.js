class Video {
    constructor() {
        this.iframes = {}
        this.pathToFile = 'some/path/to/coolvid'

    }

    get iFrames() {
        return this.iFrames;
    }

    getBestEffortTimestamp(index) {
        return this.iFrames[startIndex].best_effort_timestamp_time;
    }


}