export const TimeUtility = {
    getHourDiff: (date1, date2) => {
        date1 = new Date(date1);
        date2 = new Date(date2);
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60));
    },
    getTimeStr: (timestamp) => {
        let now = new Date();
        let mins = Math.floor((now-timestamp)/(60000)); // 1000*60

        if (mins > 10080) { // 1440 * 7
            return new Date(timestamp).toLocaleDateString();
        } else if (mins > 1440){ // 24*60
            return Math.floor(mins/1440) + " ngày trước";
        } else if (mins > 60){
            return Math.floor(mins/60) + " giờ trước";
        } else if(mins >= 1) {
            return mins + " phút trước";
        }else{
            return "Vừa xong"
        }
    },
    dateToDDMMYYYY(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return day + '/' + month + '/' + year;
      }
};