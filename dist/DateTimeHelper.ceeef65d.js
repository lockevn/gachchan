class $9f4ef5d60fcd0c03$export$b8fc15a57d724002 {
    /**
   * if now is 2002 12 31 14:22, this return 20021231.
   * @param {Date} date
   * @returns {string}
   */ static GetCurrentYearMonthDayString(date) {
        if (!date) date = new Date();
        let ret = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
        return ret;
    }
    /**
   * if now is 14:22, this return 1422.
   * 9:40AM ==> 0940
   * 16:03 (PM) ==> 1603
   * @param {Date} date
   * @returns {string}
   */ static GetCurrentHoursMinutesString(date) {
        if (!date) date = new Date();
        let currentHoursMinutesString = date.getHours().toString().padStart(2, '0') + '' + date.getMinutes().toString().padStart(2, '0');
        return currentHoursMinutesString;
    }
    /**
   * if now is 14:22:59, this return 142259.
   * 9:40AM ==> 094000
   * 16:03 (PM) ==> 160300
   */ static GetCurrentHoursMinutesSecondsString(date) {
        if (!date) date = new Date();
        let ret = this.GetCurrentHoursMinutesString(date) + date.getSeconds().toString().padStart(2, '0');
        return ret;
    }
    /**
   *
   * @returns string the Date string in format yyyyMMdd (in UTC timezone)
   */ static GetCurrentYearMonthDayStringUTC(date) {
        if (!date) date = new Date();
        return date.toISOString().substring(0, 10).replace(/-/g, '');
    }
    /**
   *
   * @returns string the Time string in format HHmm (in UTC timezone)
   */ static GetCurrentHoursMinutesStringUTC(date) {
        if (!date) date = new Date();
        return date.toISOString().substring(11, 16).replace(/:/g, '');
    }
    /**
   *
   * @returns string the Time string in format HHmmss (in UTC timezone)
   */ static GetCurrentHoursMinutesSecondsStringUTC(date) {
        if (!date) date = new Date();
        return date.toISOString().substring(11, 19).replace(/:/g, '');
    }
    /** full yearmonthdaytime string in UTC timezone, without ":" char (safe for file naming) */ static getCurrentISOStringUTC() {
        return new Date().toISOString().replace(/:/g, '');
    }
    /**
   * return current date time in full format, in specific culture (language) and timezone.
   * new Date().toLocaleString("vi-VN", { timezone: "Asia/Saigon", hour12: false })
   * @param {*} culture
   * @param {*} timezone
   * @returns
   */ static GetDatetimeNowString(culture = 'vi-VN', timezone = 'Asia/Saigon') {
        return new Intl.DateTimeFormat(culture, {
            //
            timeZone: timezone,
            dateStyle: 'full',
            timeStyle: 'long',
            hour12: false
        }).format(new Date());
    }
    /** return the DateTime object like it was get with `new Date()` in a host computer in expected timezone */ static GetTimeInGMTTimezone(gmtHour = 7) {
        const now = new Date();
        // Adjust for user's local time zone offset
        const utcOffset = // when calling this in GMT+7, it return -420 minutes
        now.getTimezoneOffset() * // Convert minutes to milliseconds
        60000;
        const timeInExpectedGMTTimezone = new Date(now.getTime() + utcOffset + gmtHour * 3600000) // gmtHour = 7, Add 7 hours for GMT+7
        ;
        return timeInExpectedGMTTimezone;
    }
}


export {$9f4ef5d60fcd0c03$export$b8fc15a57d724002 as DateTimeHelper};
//# sourceMappingURL=DateTimeHelper.ceeef65d.js.map
