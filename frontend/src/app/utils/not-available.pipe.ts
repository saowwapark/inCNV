import { PipeTransform, Pipe } from '@angular/core';

/**
 * {{ [data] | shorten }} -> nothing changed
 * {{ [data] | shorten:10 }} -> show string only 10 first characters
 */
@Pipe({
  name: 'notAvailable'
})
export class NotAvailablePipe implements PipeTransform {
  transform(value: string) {
    if (value === null || value === undefined || value.length === 0) {
      return 'N/A';
    } else {
      return value;
    }
  }
}
