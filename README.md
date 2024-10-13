# Integration Tests with no mocking Node.js code

## Table of Contents
- [Description](#description)
- [Key Features](#key-features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [License](#license)

## Description
Typically, when it comes to setting up integration tests and working with external dependencies, an approach is used where components are simulated through mocks. This means that database responses or requests via `axios` are artificially replaced with pre-defined results directly in the code. However, this repository demonstrates an alternative approach, where the tests interact with real external services, allowing for more accurate and comprehensive end-to-end validation of the application's functionality.
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
Rather than simulating components in code by mocking responses from the database or axios, this approach focuses on testing real interactions with external services. This ensures more accurate, end-to-end validation of your application's behavior. If you want to test how your app interacts with external client or provider APIs without mocking tools like axios, consider the following example:
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
The solution for more realistic testing is using [mockserver](https://www.mock-server.com). This approach allows you to define expected request-response schemas, ensuring that your app reacts correctly to all possible scenarios from the provider API. For example, you can specify:
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
The schema can be more detailed based on your needs. Mocking the database or handling events in message brokers is simpler and typically hassle-free. The core Node.js code remains unchanged (apart from adjusting environment variables for API calls). Now your scenarios are thoroughly tested, giving you confidence that the behavior will be consistent in production.
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
