declare interface DateLike {
    getMilliseconds: typeof Date.prototype.getMilliseconds,
    getSeconds: typeof Date.prototype.getSeconds,
    getMinutes: typeof Date.prototype.getMinutes,
    getHours: typeof Date.prototype.getHours,
    getDay: typeof Date.prototype.getDay,
    getDate: typeof Date.prototype.getDate,
    getMonth: typeof Date.prototype.getMonth,
    getFullYear: typeof Date.prototype.getFullYear,
    getTimezoneOffset: typeof Date.prototype.getTimezoneOffset,
    getTime: typeof Date.prototype.getTime,
    setTime: typeof Date.prototype.setTime,
}