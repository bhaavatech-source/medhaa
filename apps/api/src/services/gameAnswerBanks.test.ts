import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const gamesRoot = resolve(__dirname, '../../../web/public/games-static');

function gameSources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('_') || /(?:_OLD|\.bak)/i.test(entry.name)) return [];
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return gameSources(path);
    return ['.js', '.html'].includes(extname(entry.name)) ? [path] : [];
  });
}

function nameOf(property: ts.ObjectLiteralElementLike): string | undefined {
  if (!ts.isPropertyAssignment(property) || !property.name) return undefined;
  return ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : undefined;
}

function literal(node: ts.Node): string | number | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  return undefined;
}

describe('shipped multiple-choice game banks', () => {
  it('ships a nonblank HTML entry for every seeded game', () => {
    const seedPath = resolve(__dirname, '../../prisma/seed.ts');
    const source = ts.createSourceFile(seedPath, readFileSync(seedPath, 'utf8'), ts.ScriptTarget.Latest, true);
    const missing: string[] = [];
    let checked = 0;
    const visit = (node: ts.Node) => {
      if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'gamesData' && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
        for (const game of node.initializer.elements) {
          if (!ts.isObjectLiteralExpression(game)) continue;
          const entry = game.properties.find((property) => nameOf(property) === 'entryPath');
          if (!entry || !ts.isPropertyAssignment(entry) || !ts.isStringLiteral(entry.initializer)) continue;
          checked++;
          const path = resolve(gamesRoot, entry.initializer.text);
          if (!existsSync(path) || statSync(path).size < 100) missing.push(entry.initializer.text);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    expect(checked).toBeGreaterThan(50);
    expect(missing).toEqual([]);
  });

  it('parses standalone game scripts without JavaScript syntax errors', () => {
    const errors: string[] = [];
    let checked = 0;
    for (const path of gameSources(gamesRoot)) {
      const raw = readFileSync(path, 'utf8');
      const scripts = path.endsWith('.html')
        ? [...raw.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
            .filter((match) => !/\bsrc\s*=|\btype\s*=\s*["']application\/ld\+json/i.test(match[1]))
            .map((match) => match[2])
        : [raw];
      for (const script of scripts) {
        if (!script.trim()) continue;
        checked++;
        const parsed = ts.createSourceFile(path, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
        for (const diagnostic of parsed.parseDiagnostics) {
          const line = parsed.getLineAndCharacterOfPosition(diagnostic.start || 0).line + 1;
          errors.push(`${path.replace(gamesRoot, '')}: ${line} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
        }
      }
    }
    expect(checked).toBeGreaterThan(200);
    expect(errors).toEqual([]);
  });

  it('keeps literal correct answers within each question’s options', () => {
    const invalid: string[] = [];
    let checked = 0;
    for (const path of gameSources(gamesRoot)) {
      const raw = readFileSync(path, 'utf8');
      const scripts = path.endsWith('.html')
        ? [...raw.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
            .filter((match) => !/\bsrc\s*=|\btype\s*=\s*["']application\/ld\+json/i.test(match[1]))
            .map((match) => match[2])
        : [raw];
      for (const script of scripts) {
        const source = ts.createSourceFile(path, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
        const visit = (node: ts.Node) => {
          if (ts.isObjectLiteralExpression(node)) {
            const fields = new Map(node.properties.map((property) => [nameOf(property), property]));
            const choiceField = fields.get('opts') ?? fields.get('options');
            const answerField = fields.get('ans') ?? fields.get('answer') ?? fields.get('correctIndex');
            if (choiceField && answerField && ts.isPropertyAssignment(choiceField) && ts.isArrayLiteralExpression(choiceField.initializer) && ts.isPropertyAssignment(answerField)) {
              const options = choiceField.initializer.elements.map(literal);
              const answer = literal(answerField.initializer);
              if (options.length >= 2 && options.every((item) => item !== undefined) && answer !== undefined) {
                checked++;
                const location = `${path.replace(gamesRoot, '')}: line ${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}`;
                if (new Set(options).size !== options.length) invalid.push(`${location} duplicate options`);
                const valid = typeof answer === 'number'
                  ? (Number.isInteger(answer) && answer >= 0 && answer < options.length) || options.includes(answer)
                  : options.includes(answer);
                if (!valid) invalid.push(`${location} (${String(answer)})`);
              }
            }
          }
          ts.forEachChild(node, visit);
        };
        visit(source);
      }
    }
    expect(checked).toBeGreaterThan(100);
    expect(invalid).toEqual([]);
  });
});