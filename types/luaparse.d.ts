declare module 'luaparse' {
  interface Options {
    comments?: boolean;
    scope?: boolean;
    locations?: boolean;
    ranges?: boolean;
  }
  export function parse(code: string, options?: Options): any;
}
