import {
  GenericContainer,
  GenericContainerBuilder,
  StartedTestContainer,
  Wait,
} from 'testcontainers';
import * as process from 'process';
import { Containers } from '../consts/containers.const';

export class NodeContainer {
  protected containerBuilder: GenericContainerBuilder;
  protected container: GenericContainer;
  protected startedContainer: StartedTestContainer;
  constructor(protected network: string) {
    this.containerBuilder = GenericContainer.fromDockerfile(
      process.cwd(),
      'Dockerfile',
    );
  }

  public async run(): Promise<void> {
    this.container = await this.containerBuilder.build();
    this.container
      .withNetworkMode(this.network)
      .withName(Containers.NodeContainer)
      .withReuse()
      .withExposedPorts({ container: 3000, host: 3000 })
      .withBindMounts([
        {
          source: process.cwd(),
          target: '/usr/src/app',
          mode: 'rw',
        },
      ])
      .withWaitStrategy(Wait.forListeningPorts());
    this.startedContainer = await this.container.start();
  }

  public async gracefulShutdown(): Promise<void> {
    await this.startedContainer.restart();
  }
}
