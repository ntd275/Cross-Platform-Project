export const TimeUtility = {
    getHourDiff: (date1, date2) => {
        date1 = new Date(date1);
        date2 = new Date(date2);
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60));
    },
    getTimeStr: (timestamp) => {
        let now = new Date();
        let mins = Math.ceil((now-timestamp)/(60000)); // 1000*60
        if (mins > 525600){ // 24*365*60
            return Math.ceil(mins/525600) + " năm";
        } else if (mins > 43200) { // 24*30*60
            return Math.ceil(mins/43200) + " tháng";
        } else if (mins > 1440){ // 24*60
            return Math.ceil(mins/1440) + " ngày";
        } else if (mins > 60){
            return Math.ceil(mins/60) + " giờ";
        } else {
            return mins + " phút";
        }
    }
};