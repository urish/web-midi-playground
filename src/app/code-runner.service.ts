import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as ts from 'typescript';
import { CodeHighlighterService } from './code-highlighter.service';
import { MockMidiTrumpetService } from './mock-midi-trumpet.service';

export type IHighlightRange = [number, number, number, number];

export interface IHighlightInfo {
  type: string;
  range: IHighlightRange;
}

@Injectable({
  providedIn: 'root'
})
export class CodeRunnerService {
  public mockMidi = location.search.indexOf('mockMidi=1') >= 0;

  readonly highlight$ = fromEvent(window, 'message').pipe(
    map((messageEvent: MessageEvent) => messageEvent.data as IHighlightInfo),
    filter(data => data.type === 'editor$highlight')
  );

  constructor(
    private mockMidiTrumpet: MockMidiTrumpetService,
    private codeHighlighter: CodeHighlighterService
  ) {
    if (this.mockMidi) {
      this.mockMidiTrumpet.init();
    }
  }

  private addHighlightMethod(target: Window) {
    (target as any)._$highlight = function(range: IHighlightRange, retVal) {
      target.parent.postMessage(
        {
          type: 'editor$highlight',
          range
        } as IHighlightInfo,
        '*'
      );
      return retVal;
    };
  }

  async transpileAndRun(
    model: monaco.editor.ITextModel,
    target: HTMLIFrameElement
  ) {
    const sourceCode = model.getValue();
    const instrumented = this.codeHighlighter.instrumentCode(sourceCode);
    const compiledCode = ts.transpile(instrumented, {
      target: ts.ScriptTarget.ES2018
    });

    target.src = 'about:blank';
    const frameWindow = target.contentWindow;
    const scriptElement = frameWindow.document.createElement('script');
    target.onload = () => {
      scriptElement.type = 'text/javascript';
      if (this.mockMidi) {
        (frameWindow.navigator as any).requestMIDIAccess = this.mockMidiTrumpet.createMockMidiTrumpet();
      }
      this.addHighlightMethod(frameWindow);
      scriptElement.innerHTML += compiledCode;
      frameWindow.document.head.appendChild(scriptElement);
    };
  }
}
