import * as process from 'process';
import { Eureka } from 'eureka-js-client';

const EurekaClient = (servicePort: number) =>
  new Eureka({
    instance: {
      app: 'soup-service-server',
      hostName: 'service-server-instance',
      ipAddr: 'localhost',
      port: {
        $: servicePort,
        '@enabled': true,
      },
      vipAddress: 'soup-service-server',
      statusPageUrl: `http://localhost:${servicePort}`,
      dataCenterInfo: {
        name: 'MyOwn',
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      },
    },
    eureka: {
      host: 'localhost',
      port: 8761,
      servicePath: '/eureka/apps/',
      maxRetries: 10,
      requestRetryDelay: 1000,
    },
  });

export const eurekaClientStart = () => {
  const client = EurekaClient(+(process.env.APP_PORT ?? 3000));

  client.start();

  process.on('SIGINT', () => {
    client.stop();
  });
};
