var $b8f613de6ae4ce90$exports = require("./CommonHelper.691746a8.js");
var $2dc503fab9ebaa65$exports = require("./DateTimeHelper.bd0d294e.js");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "StockvnHelper", () => $458e83d411ad4aff$export$faa2f60976b8917b);


class $458e83d411ad4aff$export$faa2f60976b8917b {
    /**
   * StockCompany usually represent 1000000 (1 million) as 1,000,000
   * We need to convert it to 1000000
   * @param num
   */ static StandardizeVolNumber(num) {
        if (typeof num === 'number') return num;
        // undefined or null
        if (!num) return NaN;
        let ret = '';
        if (typeof num === 'string') ret = num.replace(/,/g, '');
        // else{
        //   // is number, do nothing
        // }
        return (0, $b8f613de6ae4ce90$exports.CommonHelper).ToNumber(ret);
    }
    /**
   * continuous checkWorkingHours and call callbackFn with interval
   * @param {*} callbackFn
   * @param {*} interval
   */ static ContinuousExecuteInWorkingHours(callbackFn, interval) {
        if (!callbackFn) return;
        let timerId = setInterval(async ()=>{
            // only perform callback in trading hours
            if (this.IsInWorkingHours() && this.IsInWorkingDays()) await callbackFn();
        }, interval);
        return timerId;
    }
    /** return current `hhmm` timestring in GMT7 timezone */ static getCurrentGMT7HoursMinutesString() {
        const gmt7time = (0, $2dc503fab9ebaa65$exports.DateTimeHelper).GetTimeInGMTTimezone(7);
        const hhmm = (0, $2dc503fab9ebaa65$exports.DateTimeHelper).GetCurrentHoursMinutesString(gmt7time);
        return hhmm;
    }
    /** return current `hhmmss` timestring in GMT7 timezone */ static getCurrentGMT7HoursMinutesSecondsString() {
        const gmt7time = (0, $2dc503fab9ebaa65$exports.DateTimeHelper).GetTimeInGMTTimezone(7);
        const hhmmss = (0, $2dc503fab9ebaa65$exports.DateTimeHelper).GetCurrentHoursMinutesSecondsString(gmt7time);
        return hhmmss;
    }
    /**
   * from "now", if in working day, get hhmm time in hhmm format, like "1130" or "0959", then check stricly inside 0845-1130 or 1300-1445
   * @param {Date} now
   * @returns boolean
   */ static IsInWorkingHours() {
        if (!this.IsInWorkingDays()) return false;
        const hhmm = this.getCurrentGMT7HoursMinutesString();
        if ('0845' <= hhmm && hhmm <= '1130' || '1300' <= hhmm && hhmm <= '1445') return true;
        else return false;
    }
    /**
   *  is in ATO sessions (stricly inside 0845-0915)
   * @param {String} nowString hhhmm string, like "1130" or "0959"
   */ static IsIn_ATO_Sessions(nowString) {
        if (!nowString) nowString = this.getCurrentGMT7HoursMinutesString();
        if (!this.IsInWorkingDays()) return false;
        if ('0845' <= nowString && nowString <= '0915') return true;
        return false;
    }
    /**
   *  is in ATC sessions (strictly inside 1430-1445)
   * @param {String} nowString hhhmm string, like "1130" or "0959"
   */ static IsIn_ATC_Sessions(nowString) {
        if (!nowString) nowString = this.getCurrentGMT7HoursMinutesString();
        if (!this.IsInWorkingDays()) return false;
        if ('1430' <= nowString && nowString <= '1445') return true;
        return false;
    }
    /**
   * return true if current moment is Monday to Friday (Vietnam working days) in GMT+7 timezone
   */ static IsInWorkingDays() {
        const gmt7time = (0, $2dc503fab9ebaa65$exports.DateTimeHelper).GetTimeInGMTTimezone(7);
        // Sunday - Saturday : 0 - 6
        const currentDay = gmt7time.getDay();
        if (0 < currentDay && currentDay < 6) return true;
        return false;
    }
    /**
   * return true if s is like HNXINDEX, I3-FIN
   * @param str SymbolCode (HPG, HNXINDEX, I3-FIN)
   */ static IsCompoundIndexSymbolCode(str) {
        if (str.search(/^I\d\-/i) == 0) return true;
        if (str.search(/INDEX/) >= 0) return true;
        return false;
    }
}


//# sourceMappingURL=StockvnHelper.c5562748.js.map
