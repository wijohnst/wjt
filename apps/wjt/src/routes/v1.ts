import Router from '@koa/router';
import { Context } from 'koa';

export const router = new Router();

router.get('/', async (ctx: Context) => {
  ctx.body = `
      <html>
          <head>
              <title>willjohnston.tech</title>
              <link rel="icon" href="https://wjt.sfo2.cdn.digitaloceanspaces.com/wjt_logo.ico" />
          </head>
          <body>
              <h1>willjohnston.tech</h1>
          </body>
      </html>
    `;
});
