import { UserEntity } from '../payment/entities/user.entity';
import { ProductEntity } from '../payment/entities/product.entity';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: Number(configService.get<string>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [UserEntity, ProductEntity],
      synchronize: true,
    };
  },
};
