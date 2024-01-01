import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';

export const redisConfig = (configService: ConfigService): RedisOptions => {
  return {
    host: configService.get<string>('REDIS_HOST'),
    port: Number(configService.get<string>('REDIS_PORT')),
  };
};
