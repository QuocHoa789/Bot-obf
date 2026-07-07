import * as luaparse from 'luaparse';

function preprocessLuau(code: string): string {
  // Xoá type annotations (cơ bản)
  code = code.replace(/:\s*[a-zA-Z_][\w.]*(\s*\|\s*[a-zA-Z_][\w.]*)*/g, '');
  // Compound assignments
  code = code.replace(/([a-zA-Z_]\w*)\s*\+=([^=])/g, '$1 = $1 + $2');
  code = code.replace(/([a-zA-Z_]\w*)\s*\-=([^=])/g, '$1 = $1 - $2');
  code = code.replace(/([a-zA-Z_]\w*)\s*\*=([^=])/g, '$1 = $1 * $2');
  code = code.replace(/([a-zA-Z_]\w*)\s*\/=([^=])/g, '$1 = $1 / $2');
  // continue -> do return end (tạm)
  code = code.replace(/\bcontinue\b/g, 'do return end --[[continue]]');
  // if-then-else expression (chỉ hỗ trợ gán đơn giản)
  code = code.replace(/(\w+)\s*=\s*if\s+(.+)\s+then\s+(.+)\s+else\s+(.+)/g, '$1 = $2 and $3 or $4');
  return code;
}

export function parseLuau(code: string): any {
  const converted = preprocessLuau(code);
  return luaparse.parse(converted, {
    comments: false,
    scope: true,
    locations: true,
    ranges: true,
  });
}
