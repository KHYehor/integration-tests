import * as amqplib from 'amqplib';

export class RabbitMqDriver {
  protected user: string = 'user';
  protected password: string = 'password';
  protected queueName: string = 'queue';
  protected connection: amqplib.Connection;
  protected channel: amqplib.Channel;

  public async init(): Promise<void> {
    this.connection = await amqplib.connect({
      hostname: 'localhost',
      port: 5672,
      username: this.user,
      password: this.password,
    });
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName);
  }

  public async waitForEvent() {
    return new Promise<string>((resolve) => {
      this.channel.consume(this.queueName, (msg) => {
        resolve(msg.content.toString('utf-8'));
      });
    });
  }

  public async gracefulShutdown(): Promise<void> {
    await this.channel.purgeQueue(this.queueName);
    await this.connection.close();
  }
}
