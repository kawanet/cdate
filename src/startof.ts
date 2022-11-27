const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

export const startOf = (dt: Date, unit: string): Date => {
    const tz = dt.getTimezoneOffset() * d.MINUTE;
    let div = 0;

    switch (unit) {
        case "year": {
            dt = startOf(dt, "day");
            dt.setMonth(0);
            dt.setDate(1);
            break;
        }

        case "month": {
            dt = startOf(dt, "day");
            dt.setDate(1);
            break;
        }

        case "week":
            dt = startOf(dt, "day");
            dt = new Date(+dt - dt.getDay() * d.DAY);
            break;

        case "date":
        case "day":
            div = d.DAY;
            break;

        case "hour":
            div = d.HOUR;
            break;

        case "minute":
            div = d.MINUTE;
            break;

        case "second":
            div = d.SECOND;
            break;
    }

    if (div) {
        dt = new Date(Math.trunc((+dt - tz) / div) * div + tz);
    }

    return dt;
}