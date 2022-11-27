const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const addMonth = (dt: Date, diff: number): Date => {
    dt = new Date(+dt);
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const date = dt.getDate();
    dt.setDate(1);
    let newMonth = year * 12 + month + diff;
    dt.setFullYear(Math.trunc(newMonth / 12));
    newMonth %= 12;
    dt.setMonth(newMonth);
    dt.setDate(date);
    if (newMonth !== dt.getMonth() && date > dt.getDate()) {
        dt.setDate(0); // the very last day of the previous month
    }
    return dt;
};

export const add = (dt: Date, diff: number, unit: string): Date => {
    switch (unit) {
        case "year":
            return addMonth(dt, diff * 12);

        case "month":
            return addMonth(dt, diff);

        case "week":
            diff *= d.DAY * 7;
            break;

        case "day":
            diff *= d.DAY;
            break;

        case "hour":
            diff *= d.HOUR;
            break;

        case "minute":
            diff *= d.MINUTE;
            break;

        case "second":
            diff *= d.SECOND;
            break;
    }

    if (diff) {
        dt = new Date(+dt + diff);
    }

    return dt;
}