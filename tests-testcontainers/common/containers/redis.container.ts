import { AbstractContainer } from './abstract.container';
import { Wait } from 'testcontainers';
import { Containers } from '../consts/containers.const';
import Redis from 'ioredis';

export class RedisContainer extends AbstractContainer {
  protected connection: Redis;
  constructor(network: string) {
    super('redis', Containers.RedisContainer, network);
    this.withExposedPorts({ container: 6379, host: 6379 }).withWaitStrategy(
      Wait.forListeningPorts(),
    );
  }

  public async run(): Promise<void> {
    await super.run();
    this.connection = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }
  public set(key: string, value: string): Promise<'OK'> {
    return this.connection.set(key, value);
  }

  public get(key: string): Promise<string> {
    return this.connection.get(key);
  }

  public async gracefulShutdown(): Promise<void> {
    await this.connection.flushall();
    this.connection.disconnect();
  }
}
