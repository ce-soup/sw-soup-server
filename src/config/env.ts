import { join } from 'path';
import { config } from 'dotenv';

config({
  path: join(process.cwd(), 'env/.env'),
});
