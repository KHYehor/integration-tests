import { AbstractContainer } from './abstract.container';
import { Wait } from 'testcontainers';
import { Containers } from '../consts/containers.const';
import * as request from 'supertest';
import { Expectation } from 'mockserver-client';

export class MockserverContainer extends AbstractContainer {
  constructor(network: string) {
    super(
      'mockserver/mockserver:5.15.0',
      Containers.MockServerContainer,
      network,
    );
    this.withExposedPorts({ container: 1080, host: 1080 }).withWaitStrategy(
      Wait.forLogMessage('started on port:'),
    );
  }

  public async run(): Promise<void> {
    return super.run();
  }

  public async mockResponse(expectation: Expectation): Promise<void> {
    await request('http://localhost:1080')
      .put('/mockserver/expectation')
      .send(expectation);
  }

  public async gracefulShutdown(): Promise<void> {
    await request('http://localhost:1080').put('/mockserver/reset').send();
  }
}
