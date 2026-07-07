import * as luaparse from 'luaparse';

export function parseLua51(code: string): any {
  return luaparse.parse(code, {
    comments: false,
    scope: true,
    locations: true,
    ranges: true,
  });
}
