import { Elysia } from "elysia";
import userRoutes from './routes/';
import { jwt } from "@elysiajs/jwt";

const app = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: 'atomic'
  }))
  .get('/', () => 'Hello, Elysia!')
  .group('/api', (app) => app.use(userRoutes))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
