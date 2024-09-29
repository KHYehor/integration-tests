# Integration Tests with no mocking Node.js code

## Table of Contents
- [Description](#description)
- [Key Features](#key-features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [License](#license)

## Description

This repository demonstrates how to effectively set up and execute integration tests for a Node.js application without using mocks inside **node.app:**

```typescript
const moduleRef: TestingModule = await Test.createTestingModule({
  controllers: [UserController],
  providers: [UserService],
})
  .overrideProvider(UserService)
  .useFactory({
    factory: () => ({
      getUserById: jest.fn((id: string) => `Global Mocked User #${id}`),
    }),
  })
  .compile();

  userController = moduleRef.get<UserController>(UserController);
```

Instead of simulating components in code like mocking what database or axios returns, the approach focuses on testing real interactions between outside services, ensuring more accurate, end-to-end validation of your application’s behavior. If you think about how your app should interact with external client or provider api without mocks of axios **(example below)**:
```typescript
import axios from 'axios';
// Set up an interceptor to mock requests
axios.interceptors.request.use((config) => {
  if (config.url === 'https://api.example.com') {
    return Promise.resolve({
      data: { result: 'mocked success' }
    });
  }
  return config;
});

axios.get('https://api.example.com')
  .then(response => console.log(response.data))  // Logs 'mocked success'
  .catch(error => console.error(error));
```
The answer is [mockserver](https://www.mock-server.com). I hope you know all possible scenarios and responses the provider api can return. You define a schema with info of expected request and response for it, like return this response if you catch this request:
```json
{
  "httpRequest": {
    "method": "GET",
    "path": "/view/cart"
  },
  "httpResponse": {
    "body": "some_response_body"
  }
}
```
The schema can be more detailed, it depends on your needs. Mocking DB or publishing events to message brokers is easier and cause no problems. In general node.js code wasn't modified or changed (except environmental variables for api calls). Now your scenarios are tested and you can be confident about identical behavior on production.
## Key Features
- **No Code Mocking: Focuses on testing real integrations, without relying on mocks or stubs in node.js.**
- **Production-like Testing: Verifies how the app interacts with external services in a more realistic, production-like environment.**
- **Supports External APIs: Tests real API interactions with services like databases or third-party providers using MockServer to define request-response pairs without hardcoding behavior.**
## Test case

- describe briefly
## Installation

### Prerequisites
- **Node.js (v14.x or higher)**
- **docker-compose**

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/KHYehor/integration-tests.git
   cd integration-tests
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file to configure environment variables:
   ```bash
   cp .env.tests .env
   ```

4. Start up docker-compose daemon (depends on the operation system);

5. Now easily run tests with 

`npm run test:integration`

or 

`npm run test:integration:testcontainers`.

## Project Structure

## **Project Structure**

```bash
.
├── src/
│   ├── ...                # Example buisnes logic
├── tests                  # Integration tests with native docker-compose
├── tests-testcontainers   # Integration tests using testcontainers library 
└── README.md              # Project documentation
```

## Technologies Used

- **Node.js**: Backend JavaScript runtime.
- **Nest.js**: Web framework for building the API.
- **Docker-compose**: PostgreSQL client for Node.js.
- **jest**: Testing framework for running the integration tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
