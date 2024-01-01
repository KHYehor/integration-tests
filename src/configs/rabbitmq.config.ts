import { ConfigService } from '@nestjs/config';
import { Options } from 'amqplib/properties';

export const rabbitmqConfig = (
  configService: ConfigService,
): Options.Connect => {
  return {
    hostname: configService.get<string>('RABBITMQ_HOST', 'amqp://localhost'),
    port: Number(configService.get<string>('RABBITMQ_PORT', '5672')),
    username: configService.get<string>('RABBITMQ_USER', 'user'),
    password: configService.get<string>('RABBITMQ_PASSWORD', 'password'),
  };
};
