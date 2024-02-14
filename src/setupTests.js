import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    // Respond with mock user data or conditionally based on request parameters
    return res(ctx.json([{ name: 'John Doe', email: 'johndoe@example.com' }]));
  })
);

// Start the server in your test or application setup
server.listen();

// Make requests to your mock API using `fetch` or other methods
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data));

// Optionally stop the server when done
server.close();
