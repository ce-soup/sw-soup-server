import { ValidationPipe as VP, ValidationPipeOptions } from '@nestjs/common';

const options: ValidationPipeOptions = {
  transform: true,
};

export const ValidationPipe = new VP(options);
