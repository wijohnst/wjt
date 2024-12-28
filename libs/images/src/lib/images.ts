export const isCdnImage = (path: string, matcher: RegExp) => {
  return matcher.test(path);
};
