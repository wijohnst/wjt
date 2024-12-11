import Router from '@koa/router';
import { router as v1Router } from './v1';

const router = new Router();

router.use(v1Router.routes());

export { router };
