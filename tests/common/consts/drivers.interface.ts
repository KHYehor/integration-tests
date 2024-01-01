import { RedisDriver } from '../drivers/redis.drvier';
import { PostgresDriver } from '../drivers/postgres.driver';
import { RabbitMqDriver } from '../drivers/rabbitMqDriver';
import { MockserverDriver } from '../drivers/mockserver.driver';

export interface IDrivers {
  redisDriver: RedisDriver;
  postgresDriver: PostgresDriver;
  rabbitMqDriver: RabbitMqDriver;
  mockServerDriver: MockserverDriver;
}
