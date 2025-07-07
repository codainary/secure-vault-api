import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((key) => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }

    return value;
  }
}
