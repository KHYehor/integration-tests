import Redis from 'ioredis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisConfig } from '../configs/redis.config';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  constructor(protected readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.client = new Redis(redisConfig(this.configService));
  }

  async setValue(key: string, value: string): Promise<'OK'> {
    return this.client.set(key, value);
  }

  async getValue(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
