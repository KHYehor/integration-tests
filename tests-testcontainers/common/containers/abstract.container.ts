import {
  GenericContainer,
  StartedTestContainer,
  StoppedTestContainer,
} from 'testcontainers';
import { Containers } from '../consts/containers.const';

export abstract class AbstractContainer extends GenericContainer {
  protected container: StartedTestContainer | undefined;
  protected constructor(
    public image: string,
    protected containerName: Containers,
    protected network: string,
  ) {
    super(image);
    this.withName(containerName)
      .withNetworkMode(network)
      .withReuse()
      .withStartupTimeout(1200000000);
  }

  protected async run(): Promise<void> {
    this.container = await this.start();
  }

  public async stop(): Promise<StoppedTestContainer> {
    return this.container.stop();
  }

  public abstract gracefulShutdown(): Promise<void>;
}
