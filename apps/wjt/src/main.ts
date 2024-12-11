import koa from 'koa';
import serve from '@ladjs/koa-better-static';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 4200;

const staticPath = __dirname + '/static';
const staticServe = serve(staticPath);

const app = new koa();

app.use(async (ctx, next) => {
  return staticServe(ctx, next);
});
app.use(async (ctx) => {
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

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
