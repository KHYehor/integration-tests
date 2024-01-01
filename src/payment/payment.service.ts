import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { PurchaseDto } from './dtos/purchase.dto';
import { PurchaseResponseDto } from './dtos/purchase-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { RabbitmqService } from '../external-services/rabbitmq.service';
import { RedisService } from '../external-services/redis.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from 'axios';
import { ProductService } from '../product/product.service';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class PaymentService {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    @InjectRepository(UserEntity)
    protected readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    protected readonly productRepository: Repository<ProductEntity>,
    protected rabbitMqService: RabbitmqService,
    protected redisService: RedisService,
    protected productService: ProductService,
  ) {}

  public async purchase({ userId, product }: PurchaseDto) {
    const [userEntity, productEntity, userHasProduct] = await Promise.all([
      this.userRepository.findOne({
        where: { id: userId },
      }),
      this.productRepository.findOne({
        where: { name: product },
      }),
      this.userRepository.findOne({
        where: {
          products: {
            name: product,
          },
        },
      }),
    ]);

    if (!userEntity) {
      throw new Error('No user found');
    }
    if (!productEntity) {
      throw new Error('No product found');
    }
    if (userHasProduct) {
      throw new Error('User already has product');
    }

    const generatedCode = this.productService.generateCode({ userId, product });

    const response = await lastValueFrom(
      this.httpService.put(this.configService.get<string>('VERIFY_LINK'), {
        generatedCode,
      }),
    );

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error("Code can't be generated");
    }

    if (Array.isArray(userEntity.products)) {
      userEntity.products.push(productEntity);
    } else {
      userEntity.products = [productEntity];
    }

    await this.userRepository.save(userEntity);

    setImmediate(async () => {
      await Promise.all([
        this.rabbitMqService.sendMessage(
          'queue',
          JSON.stringify({ userId, product }),
        ),
        this.redisService.setValue(userId.toString(), product),
      ]);
    });

    return new PurchaseResponseDto({ generatedCode });
  }
}
