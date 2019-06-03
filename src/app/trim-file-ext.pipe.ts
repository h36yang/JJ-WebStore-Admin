import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimFileExt'
})
export class TrimFileExtPipe implements PipeTransform {

  transform(value: string): string {
    const end = value.lastIndexOf('.');
    return end === -1 ? value : value.substring(0, end);
  }
}
