export function generateLua(node: any): string {
  if (!node) return '';
  switch (node.type) {
    case 'Chunk':
      return (node.body || []).map(generateLua).join('\n');
    case 'FunctionDeclaration':
      const id = node.identifier ? generateLua(node.identifier) : '';
      const params = (node.parameters || []).map((p: any) => p.name || generateLua(p)).join(',');
      const body = generateLua(node.body);
      return `function ${id}(${params})\n${body}\nend`;
    case 'ReturnStatement':
      return `return ${(node.arguments || []).map(generateLua).join(',')}`;
    case 'CallStatement':
    case 'ExpressionStatement':
      return generateLua(node.expression);
    case 'CallExpression':
      const base = generateLua(node.base);
      const args = (node.arguments || []).map(generateLua).join(',');
      return `${base}(${args})`;
    case 'Identifier':
      return node.name;
    case 'MemberExpression':
      const obj = generateLua(node.base);
      const prop = node.identifier ? node.identifier.name : generateLua(node.property);
      return node.indexer === ':' ? `${obj}:${prop}` : `${obj}.${prop}`;
    case 'IndexExpression':
      return `${generateLua(node.base)}[${generateLua(node.index)}]`;
    case 'StringLiteral':
      const escaped = node.value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"');
      return `"${escaped}"`;  // giữ nguyên escape
    case 'NumericLiteral':
      return String(node.value);
    case 'BooleanLiteral':
      return node.value ? 'true' : 'false';
    case 'NilLiteral':
      return 'nil';
    case 'VarargLiteral':
      return '...';
    case 'UnaryExpression':
      return node.operator + generateLua(node.argument);
    case 'BinaryExpression':
      return `${generateLua(node.left)} ${node.operator} ${generateLua(node.right)}`;
    case 'LogicalExpression':
      return `${generateLua(node.left)} ${node.operator} ${generateLua(node.right)}`;
    case 'AssignmentStatement':
      const vars = (node.variables || []).map(generateLua).join(',');
      const vals = (node.init || []).map(generateLua).join(',');
      return `${vars} = ${vals}`;
    case 'LocalStatement':
      const locals = (node.variables || []).map(generateLua).join(',');
      const inits = (node.init || []).map(generateLua).join(',');
      return `local ${locals}${inits ? ' = ' + inits : ''}`;
    case 'IfStatement':
      let str = '';
      for (const clause of node.clauses || []) {
        if (clause.condition) {
          str += `if ${generateLua(clause.condition)} then\n${(clause.body||[]).map(generateLua).join('\n')}\n`;
        } else {
          str += `else\n${(clause.body||[]).map(generateLua).join('\n')}\n`;
        }
      }
      return str + 'end';
    case 'WhileStatement':
      return `while ${generateLua(node.condition)} do\n${(node.body||[]).map(generateLua).join('\n')}\nend`;
    case 'RepeatStatement':
      return `repeat\n${(node.body||[]).map(generateLua).join('\n')}\nuntil ${generateLua(node.condition)}`;
    case 'ForNumericStatement':
      const v = generateLua(node.variable);
      const s = generateLua(node.start);
      const e = generateLua(node.end);
      const step = node.step ? `,${generateLua(node.step)}` : '';
      return `for ${v}=${s},${e}${step} do\n${(node.body||[]).map(generateLua).join('\n')}\nend`;
    case 'ForGenericStatement':
      const vars = (node.variables || []).map(generateLua).join(',');
      const iters = (node.iterators || []).map(generateLua).join(',');
      return `for ${vars} in ${iters} do\n${(node.body||[]).map(generateLua).join('\n')}\nend`;
    case 'TableConstructorExpression':
      const fields = (node.fields || []).map((f: any) => {
        if (f.type === 'TableKey') {
          return `[${generateLua(f.key)}] = ${generateLua(f.value)}`;
        } else if (f.type === 'TableValue') {
          return generateLua(f.value);
        } else if (f.type === 'TableKeyString') {
          return `${f.key.name} = ${generateLua(f.value)}`;
        }
        return '';
      }).join(',');
      return `{${fields}}`;
    case 'GotoStatement':
      return `goto ${node.label}`;
    case 'LabelStatement':
      return `::${node.label}::`;
    case 'BreakStatement':
      return 'break';
    default:
      if (node.raw) return node.raw;
      // fallback
      console.warn(`Unhandled node type: ${node.type}`);
      return `--[[ ${node.type} ]]`;
  }
}
