import koa from 'koa';
import views from '@ladjs/koa-views';
import serve from '@ladjs/koa-better-static';
import { router } from './routes';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 4200;

const viewsPath = __dirname + '/views';
const staticPath = __dirname + '/static';
const staticServe = serve(staticPath);

const render = views(viewsPath, {
  extension: 'pug',
});

const app = new koa();

app.use(render);
app.use(async (ctx, next) => {
  return staticServe(ctx, next);
});
app.use(router.routes());

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
