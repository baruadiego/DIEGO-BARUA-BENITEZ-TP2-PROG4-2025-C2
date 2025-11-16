import {
  differenceInDays,
  differenceInMonths,
  differenceInYears
} from 'date-fns';

export function getDiference(startDate: string, endDate: string) {
    if(differenceInYears(endDate, startDate) > 0) {
      return 'year';
    }else if(differenceInMonths(endDate, startDate) > 0) {
      return 'month';
    }else if(differenceInDays(endDate, startDate) >= 7) {
      return 'dayOfMonth';
    }else if(differenceInDays(endDate, startDate) < 7) {
      return 'day';
    }

    return null;
  }