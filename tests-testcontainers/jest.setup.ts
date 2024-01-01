import { DockerContainersManager } from './common/docker-containers-manager';
import { IContainers } from './common/interfaces/containers.interface';

beforeAll(
  async () => {
    global.manager = new DockerContainersManager();
    global.containers = await global.manager.up();
  },
  5 * 60 * 1000,
);

afterAll(
  async () => {
    const {
      redisContainer,
      postgresContainer,
      mockServerContainer,
      rabbitMqContainer,
      nodeContainer,
    } = global.containers as IContainers;
    await Promise.all([
      redisContainer.gracefulShutdown(),
      postgresContainer.gracefulShutdown(),
      mockServerContainer.gracefulShutdown(),
      rabbitMqContainer.gracefulShutdown(),
      nodeContainer.gracefulShutdown(),
    ]);
  },
  5 * 60 * 1000,
);
