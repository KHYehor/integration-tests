import { RedisContainer } from './containers/redis.container';
import { PostgresContainer } from './containers/postgres.container';
import { MockserverContainer } from './containers/mockserver.container';
import { NodeContainer } from './containers/node.container';
import { RabbitmqContainer } from './containers/rabbitmq.container';
import { exec } from 'child_process';
import { IContainers } from './interfaces/containers.interface';
import { AbstractContainer } from './containers/abstract.container';

export class DockerContainersManager {
  protected containers: AbstractContainer[] = [];

  protected async createNetworkIfNotExists(networkName: string) {
    await new Promise((resolve, reject) => {
      exec(
        `docker network inspect ${networkName} > /dev/null 2>&1 || docker network create ${networkName}`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            return reject([error, stderr]);
          }
          return resolve(stdout);
        },
      );
    });
  }

  public async up(): Promise<IContainers> {
    const networkName = 'test_container_network';
    await this.createNetworkIfNotExists(networkName);

    const redisContainer = new RedisContainer(networkName);
    const postgresContainer = new PostgresContainer(networkName);
    const mockServerContainer = new MockserverContainer(networkName);
    const nodeContainer = new NodeContainer(networkName);
    const rabbitMqContainer = new RabbitmqContainer(networkName);

    await Promise.all([
      redisContainer.run(),
      postgresContainer.run(),
      mockServerContainer.run(),
      rabbitMqContainer.run(),
    ]);

    await nodeContainer.run();
    return {
      redisContainer,
      postgresContainer,
      mockServerContainer,
      nodeContainer,
      rabbitMqContainer,
    };
  }
}
