import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [RabbitmqService, RedisService],
  imports: [ConfigModule],
  exports: [RabbitmqService, RedisService],
})
export class ExternalServicesModule {}
