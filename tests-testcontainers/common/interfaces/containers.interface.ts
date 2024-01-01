import { RedisContainer } from '../containers/redis.container';
import { PostgresContainer } from '../containers/postgres.container';
import { MockserverContainer } from '../containers/mockserver.container';
import { NodeContainer } from '../containers/node.container';
import { RabbitmqContainer } from '../containers/rabbitmq.container';

export interface IContainers {
  redisContainer: RedisContainer;
  postgresContainer: PostgresContainer;
  mockServerContainer: MockserverContainer;
  nodeContainer: NodeContainer;
  rabbitMqContainer: RabbitmqContainer;
}
