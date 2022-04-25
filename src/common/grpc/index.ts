import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcOptions = (path: string): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    url: `${process.env.NODE_ENV === 'production' ? 'soup' : 'localhost'}:${+(process.env.GRPC_PORT ?? '5000')}`,
    package: 'soup',
    protoPath: [join(path, 'member.proto')],
    loader: {
      longs: Number,
      defaults: true,
    },
  },
});
