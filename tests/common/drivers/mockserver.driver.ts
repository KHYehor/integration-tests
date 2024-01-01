import { Expectation } from 'mockserver-client';
import * as request from 'supertest';

export class MockserverDriver {
  protected url: string = 'http://localhost:1080';

  public async mockResponse(expectation: Expectation): Promise<void> {
    await request(this.url).put('/mockserver/expectation').send(expectation);
  }

  public async gracefulShutdown(): Promise<void> {
    await request(this.url).put('/mockserver/reset').send();
  }
}
