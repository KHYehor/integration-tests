import { MockserverDriver } from './common/drivers/mockserver.driver';
import { RedisDriver } from './common/drivers/redis.drvier';
import { PostgresDriver } from './common/drivers/postgres.driver';
import { RabbitMqDriver } from './common/drivers/rabbitMqDriver';
import { IDrivers } from './common/consts/drivers.interface';

beforeAll(async () => {
  global.drivers = {
    mockServerDriver: new MockserverDriver(),
    redisDriver: new RedisDriver(),
    postgresDriver: new PostgresDriver(),
    rabbitMqDriver: new RabbitMqDriver(),
  } as IDrivers;

  await Promise.all([
    global.drivers.redisDriver.init(),
    global.drivers.postgresDriver.init(),
    global.drivers.rabbitMqDriver.init(),
  ]);
}, 60 * 1000);

afterAll(async () => {
  await Promise.all([
    global.drivers.redisDriver.gracefulShutdown(),
    global.drivers.postgresDriver.gracefulShutdown(),
    global.drivers.rabbitMqDriver.gracefulShutdown(),
  ]);
}, 60 * 1000);
