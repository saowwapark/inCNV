import { PipeTransform, Pipe } from '@angular/core';

/**
 * {{ [data] | shorten }} -> nothing changed
 * {{ [data] | shorten:10 }} -> show string only 10 first characters
 */
@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  transform(value: any, limit: number ) {
    if (value.length > limit) {
      return value.substr(0, limit) + ' ...';
    }
    return value;
  }
}
