import { Context } from 'koa';

export const home = async (ctx: Context) => {
  await ctx.render('home.pug', { version: 'v0.0.0' });
};
