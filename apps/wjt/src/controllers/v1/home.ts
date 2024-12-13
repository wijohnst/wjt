import { Context } from 'koa';

//@ts-expect-error - package not found
import pkg from '#package';

export const home = async (ctx: Context) => {
  await ctx.render('home.pug', { version: pkg.version });
};
