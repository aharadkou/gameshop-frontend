import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagePlaceholder'
})
export class ImagePlaceholderPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value || '/img/placeholder.png';
  }

}
