// ja_JP.ts

import type {cdateNS} from "../";

const weekdayShort = ["日", "月", "火", "水", "木", "金", "土"];
const weekdayLong = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
const monthShort = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const monthLong = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export const ja_JP: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "午前" : "午後"),
    
    // 2022年1月2日日曜日 3:04:05 +00:00
    "%c": "%Y年%-m月%-d日%A %-H:%M:%S %:z",

    // 午前3:04:05
    "%r": "%p%-I:%M:%S",

    // 2022/01/02
    "%x": "%Y/%m/%d",

    // 3:04:05
    "%X": "%-H:%M:%S",
};
