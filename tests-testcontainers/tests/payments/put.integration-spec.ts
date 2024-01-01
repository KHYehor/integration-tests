import { UserEntity } from '../../../src/payment/entities/user.entity';
import { ProductEntity } from '../../../src/payment/entities/product.entity';
import * as request from 'supertest';
import { ProductName } from '../../../src/payment/enum/product-name';
import { PurchaseDto } from '../../../src/payment/dtos/purchase.dto';
import { Repository } from 'typeorm';
import { PostgresContainer } from '../../common/containers/postgres.container';
import { MockserverContainer } from '../../common/containers/mockserver.container';
import { RabbitmqContainer } from '../../common/containers/rabbitmq.container';
import { RedisContainer } from '../../common/containers/redis.container';

describe('Payment Module', () => {
  const API_URL = 'http://localhost:3000/';
  const userEntity = new UserEntity();
  const productEntity = new ProductEntity();
  let postgresContainer: PostgresContainer;
  let mockServerContainer: MockserverContainer;
  let rabbitMqContainer: RabbitmqContainer;
  let redisContainer: RedisContainer;

  let userRepository: Repository<UserEntity>;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    postgresContainer = global.containers.postgresContainer;
    mockServerContainer = global.containers.mockServerContainer;
    rabbitMqContainer = global.containers.rabbitMqContainer;
    redisContainer = global.containers.redisContainer;

    [userRepository, productRepository] = await Promise.all([
      postgresContainer.getRepository<UserEntity>(UserEntity),
      postgresContainer.getRepository<ProductEntity>(ProductEntity),
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
      await mockServerContainer.mockResponse({
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

      const [event, redisValue] = await Promise.all([
        rabbitMqContainer.waitForEvent(),
        redisContainer.get(userEntity.id.toString()),
      ]);
      expect(event).toEqual(
        JSON.stringify({ userId: 1, product: 'BasicSoftware' }),
      );
      expect(redisValue).toEqual('BasicSoftware');
    }, 999999);
  });
});
