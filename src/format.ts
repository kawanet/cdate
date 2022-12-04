export const formatMap: { [fmt: string]: string } = {
    YY: "%y", // 18 = Two-digit year
    YYYY: "%Y", // 2018 = Four-digit year
    M: "%-m", // 1-12 = The month, beginning at 1
    MM: "%m", // 01-12 = The month, 2-digits
    MMM: "%b", // Jan-Dec = The abbreviated month name
    MMMM: "%B", // January-December = The full month name
    D: "%-d", // 1-31 = The day of the month
    DD: "%d", // 01-31 = The day of the month, 2-digits
    d: "%w", // 0-6 = The day of the week, with Sunday as 0
    dd: "%a", // Su-Sa = The min name of the day of the week
    ddd: "%a", // Sun-Sat = The short name of the day of the week
    dddd: "%A", // Sunday-Saturday = The name of the day of the week
    H: "%-H", // 0-23 = The hour
    HH: "%H", // 00-23 = The hour, 2-digits
    h: "%-I", // 1-12 = The hour, 12-hour clock
    hh: "%I", // 01-12 = The hour, 12-hour clock, 2-digits
    m: "%-M", // 0-59 = The minute
    mm: "%M", // 00-59 = The minute, 2-digits
    s: "%-S", // 0-59 = The second
    ss: "%S", // 00-59 = The second, 2-digits
    SSS: "%L", // 000-999 = The millisecond, 3-digits
    Z: "%:z", // +05:00 = The offset from UTC, ±HH:mm
    ZZ: "%z", // +0500 = The offset from UTC, ±HHmm
    A: "%p", // AM PM
    a: "%P", // am pm
};
