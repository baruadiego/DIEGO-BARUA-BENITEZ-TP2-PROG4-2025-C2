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
  name: 'dateString'
})
export class DateStringPipe implements PipeTransform {

  transform(date: unknown, ...args: unknown[]): unknown {
    const formatedDate = new Date(date as string);
    const today = new Date();

    if(differenceInYears(today, formatedDate) > 0) {
      return 'Hace ' + differenceInYears(today, formatedDate) + ' años';
    }else if(differenceInMonths(today, formatedDate) > 0) {
      return 'Hace ' + differenceInMonths(today, formatedDate) + ' meses';
    }else if(differenceInDays(today, formatedDate) > 0) {
      return 'Hace ' + differenceInDays(today, formatedDate) + ' días';
    }else if(differenceInHours(today, formatedDate) > 0) {
      return 'Hace ' + differenceInHours(today, formatedDate) + ' horas';
    }else if(differenceInMinutes(today, formatedDate) > 0) {
      return 'Hace ' + differenceInMinutes(today, formatedDate) + ' minutos';
    }else if(differenceInSeconds(today, formatedDate) > 0) {
      return 'Hace ' + differenceInSeconds(today, formatedDate) + ' segundos';
    }else if(differenceInSeconds(today, formatedDate) === 0) {
      return 'Hace un momento';
    }

    return null;
  }

}
