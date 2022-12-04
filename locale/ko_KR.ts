// ko_KR.ts

import type {cdateNS} from "../";

const weekdayShort = ["일", "월", "화", "수", "목", "금", "토"];
const weekdayLong = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const monthShort = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const monthLong = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export const ko_KR: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    
    // 2022년 1월 2일 일요일 am 3시 4분 5초 +09:00
    "%c": "%Y년 %-m월 %-d일 %A %P %-H시 %-M분 %-S초 %:z",

    // 2022. 1. 2.
    "%x": "%Y. %-m. %-d.",

    // am 3:04:05
    "%X": "%P %-H:%M:%S",
};
