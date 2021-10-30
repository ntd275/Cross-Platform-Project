export const TimeUility = {
    getHourDiff: (date1, date2) => {
        date1 = new Date(date1);
        date2 = new Date(date2);
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60));
    }
};