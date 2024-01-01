import Redis from 'ioredis';

export class RedisDriver {
  protected connection: Redis;

  public async init(): Promise<void> {
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
