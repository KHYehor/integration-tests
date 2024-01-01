import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqService } from '../external-services/rabbitmq.service';
import { ExternalServicesModule } from '../external-services/external-services.module';
import { ProductModule } from '../product/product.module';

@Module({
  providers: [PaymentService, RabbitmqService],
  controllers: [PaymentController],
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
    ExternalServicesModule,
    ProductModule,
  ],
})
export class PaymentModule {}
