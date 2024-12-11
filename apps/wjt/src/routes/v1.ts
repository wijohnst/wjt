import Router from '@koa/router';
import { Context } from 'koa';

import { v1 } from '../controllers';

export const router = new Router();

router.get('/', async (ctx: Context) => {
  await v1.home(ctx);
});
