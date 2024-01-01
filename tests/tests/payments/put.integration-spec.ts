import { ProductEntity } from '../../../src/payment/entities/product.entity';
import { UserEntity } from '../../../src/payment/entities/user.entity';
import { Repository } from 'typeorm';
import { IDrivers } from '../../common/consts/drivers.interface';
import * as request from 'supertest';
import { ProductName } from '../../../src/payment/enum/product-name';
import { PurchaseDto } from '../../../src/payment/dtos/purchase.dto';

describe('Payment Module', () => {
  const API_URL = 'http://localhost:3000/';
  const userEntity = new UserEntity();
  const productEntity = new ProductEntity();
  let drivers: IDrivers;

  let userRepository: Repository<UserEntity>;
  let productRepository: Repository<ProductEntity>;

  beforeAll(async () => {
    drivers = global.drivers;
    [userRepository, productRepository] = await Promise.all([
      drivers.postgresDriver.getRepository<UserEntity>(UserEntity),
      drivers.postgresDriver.getRepository<ProductEntity>(ProductEntity),
    ]);

    userEntity.id = 1;
    userEntity.firstName = 'First Name';
    userEntity.lastName = 'Second Name';
    userEntity.isActive = true;

    productEntity.id = 1;
    productEntity.name = ProductName.BasicSoftware;
    productEntity.description = 'Test description';

    await Promise.all([
      userRepository.save(userEntity),
      productRepository.save(productEntity),
    ]);
  });

  describe('pay method', () => {
    it('should pass successfully', async () => {
      await drivers.mockServerDriver.mockResponse({
        httpRequest: {
          method: 'PUT',
          path: '/confirm',
        },
        httpResponse: {
          statusCode: 200,
        },
      });
      const purchaseDto: PurchaseDto = new PurchaseDto();
      purchaseDto.product = productEntity.name;
      purchaseDto.userId = userEntity.id;

      const { body, statusCode } = await request(API_URL)
        .put('payment')
        .send(purchaseDto);

      expect(statusCode).toBe(200);
      expect(body).toEqual({
        generatedCode: '9f377383e916b7572b793c5f1354e73b',
      });

      const event = await drivers.rabbitMqDriver.waitForEvent();
      const redisValue = await drivers.redisDriver.get(
        userEntity.id.toString(),
      );
      expect(event).toEqual(
        JSON.stringify({ userId: 1, product: 'BasicSoftware' }),
      );
      expect(redisValue).toEqual('BasicSoftware');
    }, 999999);
  });
});
