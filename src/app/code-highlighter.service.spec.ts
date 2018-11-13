import { CodeHighlighterService } from './code-highlighter.service';

describe('CodeHighlighterService', () => {
  describe('instrumentCode', () => {
    it('should not modify standard functions', () => {
      const service = new CodeHighlighterService();
      const src = `
        function f() {
          return 5;
        }
      `;
      expect(service.instrumentCode(src)).toEqual(src);
    });

    it('should instrument async functions', () => {
      const service = new CodeHighlighterService();
      const src = `
        async function f() {
          await foo();
        }
      `;
      expect(service.instrumentCode(src)).toEqual(`
        async function f() {
          _$highlight(null, (await _$highlight([3,11,3,22], foo())));
        }
      `);
    });
  });
});
