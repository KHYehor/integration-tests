import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ExternalServicesModule } from './external-services/external-services.module';
import { ProductModule } from './product/product.module';
import { typeormConfig } from './configs/typeorm.config';

@Module({
  imports: [
    PaymentModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeormConfig),
    ExternalServicesModule,
    ProductModule,
  ],
})
export class AppModule {}
