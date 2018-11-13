import { Injectable } from '@angular/core';
import { tsquery } from '@phenomnomnominal/tsquery';
import { FunctionDeclaration, AwaitExpression } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class CodeHighlighterService {
  constructor() {}

  instrumentCode(src: string) {
    const ast = tsquery.ast(src);
    const results = tsquery.query<AwaitExpression>(
      ast,
      ':function:has(AsyncKeyword) AwaitExpression'
    );
    const replacements: Array<[number, string]> = [];
    for (const result of results) {
      const startPos = ast.getLineAndCharacterOfPosition(result.getStart());
      const endPos = ast.getLineAndCharacterOfPosition(result.getEnd());
      const pos = JSON.stringify([
        startPos.line + 1,
        startPos.character + 1,
        endPos.line + 1,
        endPos.character + 1
      ]);
      replacements.push([result.getStart(), '_$highlight(null, (']);
      replacements.push([result.getEnd(), '))']);
      replacements.push([result.expression.getStart(), `_$highlight(${pos}, `]);
      replacements.push([result.expression.getEnd(), ')']);
    }

    replacements.sort((e1, e2) => e2[0] - e1[0]);
    for (const [pos, newContent] of replacements) {
      src = src.substr(0, pos) + newContent + src.substr(pos);
    }
    return src;
  }
}
