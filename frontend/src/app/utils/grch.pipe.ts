import { PipeTransform, Pipe } from '@angular/core';

/**
 * {{ [data] | shorten }} -> nothing changed
 * {{ [data] | shorten:10 }} -> show string only 10 first characters
 */
@Pipe({
  name: 'grch'
})
export class GrchPipe implements PipeTransform {
  transform(value: string) {
    if (value === 'grch37') {
      return 'GRCh37';
    } else if (value === 'grch38') {
      return 'GRCh38';
    } else {
      return value;
    }
  }
}
