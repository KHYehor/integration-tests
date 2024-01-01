import { AbstractContainer } from './abstract.container';
import { Wait } from 'testcontainers';
import { Containers } from '../consts/containers.const';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { ProductEntity } from '../../../src/payment/entities/product.entity';
import { UserEntity } from '../../../src/payment/entities/user.entity';
import { EntityTarget } from 'typeorm/common/EntityTarget';

export class PostgresContainer extends AbstractContainer {
  protected userName: string = 'root';
  protected password: string = 'password';
  protected dbName: string = 'database';
  protected dataSource: DataSource;
  constructor(network: string) {
    super('postgres', Containers.PostgresContainer, network);
    this.withEnvironment({
      POSTGRES_USER: this.userName,
      POSTGRES_PASSWORD: this.password,
      POSTGRES_DB: this.dbName,
    })
      .withExposedPorts({ container: 5432, host: 5432 })
      .withWaitStrategy(Wait.forListeningPorts());

    this.dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: this.userName,
      password: this.password,
      database: this.dbName,
      synchronize: false,
      logging: false,
      entities: [ProductEntity, UserEntity],
    });
  }

  public async run(): Promise<void> {
    await super.run();
    await this.dataSource.initialize();
  }

  public async getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    return this.dataSource.getRepository<T>(entity);
  }

  protected async truncateAllTables(): Promise<void> {
    await this.dataSource.manager.query(
      `TRUNCATE product_entity, user_entity, user_entity_products_product_entity RESTART IDENTITY;`,
    );
  }

  public async gracefulShutdown(): Promise<void> {
    await this.truncateAllTables();
    await this.dataSource.destroy();
  }
}
