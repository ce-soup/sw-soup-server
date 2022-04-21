import { ValidationPipe as VP, ValidationPipeOptions } from '@nestjs/common';

const options: ValidationPipeOptions = {
  transform: false,
};

export const ValidationPipe = new VP(options);
