import * as amqp from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { rabbitmqConfig } from '../configs/rabbitmq.config';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.ConfirmChannel;

  constructor(protected readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
    this.channel = await this.connection.createConfirmChannel();
    await this.channel.assertQueue(
      this.configService.get<string>('RABBITMQ_QUEUE_NAME'),
    );
  }

  async connect() {
    try {
      this.connection = await amqp.connect(rabbitmqConfig(this.configService));
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return this.connect();
    }
  }

  async sendMessage(
    queue: string,
    message: string,
  ): Promise<amqp.Replies.Empty> {
    return new Promise<amqp.Replies.Empty>((resolve, reject) => {
      this.channel.sendToQueue(
        queue,
        Buffer.from(message),
        {
          persistent: true,
        },
        (err, ok) => {
          if (err) {
            reject(err);
          } else {
            resolve(ok);
          }
        },
      );
    });
  }
}
