import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'messageTime',
})
export class MessageTimePipe implements PipeTransform {
  transform(value: string): string {
    const dateTime = DateTime.fromISO(value);
    const timeOnly = dateTime.toLocaleString(DateTime.TIME_SIMPLE);

    return timeOnly;
  }
}
