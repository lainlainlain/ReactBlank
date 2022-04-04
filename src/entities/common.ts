import { Moment } from "moment";

export function compareDates( a: Moment, b: Moment ) {
    if (a.isBefore(b)) {
        return -1;
    }
    if (a.isAfter(b)) {
        return 1;
    }
    return 0;
}