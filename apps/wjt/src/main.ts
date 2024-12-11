import koa from 'koa';
import serve from '@ladjs/koa-better-static';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const staticPath = __dirname + '/static';
const staticServe = serve(staticPath);

const app = new koa();

app.use(async (ctx, next) => {
  return staticServe(ctx, next);
});
app.use(async (ctx) => {
  ctx.body = { message: 'Hello API' };
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
