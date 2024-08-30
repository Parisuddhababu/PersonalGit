import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'formatCkEditorObject',
})
export class FormatCkEditorObjectPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const result = value;
    result['language'] = 'en';
    if (args[0] !== undefined && args[0] !== null && args[0].length > 0) {
      result['language'] = args[0];
    }
    return result;
  }
}
