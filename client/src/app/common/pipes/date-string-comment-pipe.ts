import { Pipe, PipeTransform } from '@angular/core';
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears
} from 'date-fns';


@Pipe({
  name: 'dateCommentString'
})
export class DateCommentStringPipe implements PipeTransform {

  transform(date: unknown, ...args: unknown[]): unknown {
    const formatedDate = new Date(date as string);
    const today = new Date();

    if(differenceInYears(today, formatedDate) > 0) {
      return differenceInYears(today, formatedDate) + ' a';
    }else if(differenceInMonths(today, formatedDate) > 0) {
      return differenceInMonths(today, formatedDate) + ' m';
    }else if(differenceInDays(today, formatedDate) > 0) {
      return differenceInDays(today, formatedDate) + ' d';
    }else if(differenceInHours(today, formatedDate) > 0) {
      return differenceInHours(today, formatedDate) + ' h';
    }else if(differenceInMinutes(today, formatedDate) > 0) {
      return differenceInMinutes(today, formatedDate) + ' min';
    }else if(differenceInSeconds(today, formatedDate) > 0) {
      return differenceInSeconds(today, formatedDate) + ' s';
    }else if(differenceInSeconds(today, formatedDate) === 0) {
      return '1 s';
    }

    return null;
  }

}
