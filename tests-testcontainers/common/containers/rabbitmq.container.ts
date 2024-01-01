import { AbstractContainer } from './abstract.container';
import { Wait } from 'testcontainers';
import { Containers } from '../consts/containers.const';
import * as amqplib from 'amqplib';

export class RabbitmqContainer extends AbstractContainer {
  protected user: string = 'user';
  protected password: string = 'password';
  protected queueName: string = 'queue';
  protected connection: amqplib.Connection;
  protected channel: amqplib.Channel;

  constructor(network: string) {
    super('rabbitmq:management-alpine', Containers.RabbitMqContainer, network);
    this.withExposedPorts({ container: 5672, host: 5672 })
      .withExposedPorts({ container: 15672, host: 15672 })
      .withWaitStrategy(Wait.forListeningPorts())
      .withEnvironment({
        RABBITMQ_DEFAULT_USER: this.user,
        RABBITMQ_DEFAULT_PASS: this.password,
      });
  }

  public async run(): Promise<void> {
    await super.run();
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
