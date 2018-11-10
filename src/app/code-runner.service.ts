import { Injectable } from '@angular/core';
import { LanguageService } from 'typescript';
import { MockMidiTrumpetService } from './mock-midi-trumpet.service';

@Injectable({
  providedIn: 'root'
})
export class CodeRunnerService {
  public mockMidi = location.search.indexOf('mockMidi=1') >= 0;

  constructor(private mockMidiTrumpet: MockMidiTrumpetService) {
    if (this.mockMidi) {
      this.mockMidiTrumpet.init();
    }
  }

  async transpileAndRun(
    model: monaco.editor.ITextModel,
    target: HTMLIFrameElement
  ) {
    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const client: LanguageService = await worker(model.uri);
    const result = await client.getEmitOutput(model.uri.toString());
    const compiledCode = result.outputFiles[0].text;

    target.src = 'about:blank';
    const frameWindow = target.contentWindow;
    const scriptElement = frameWindow.document.createElement('script');
    target.onload = () => {
      scriptElement.type = 'text/javascript';
      if (this.mockMidi) {
        (frameWindow.navigator as any).requestMIDIAccess = this.mockMidiTrumpet.createMockMidiTrumpet();
      }
      scriptElement.innerHTML += compiledCode;
      frameWindow.document.head.appendChild(scriptElement);
    };
  }
}
