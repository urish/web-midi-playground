import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  NgZone
} from '@angular/core';
import { LanguageService } from 'typescript';
import { codeTemplate } from '../code-template';
import { MockMidiTrumpetService } from '../mock-midi-trumpet.service';

const MOCK_MIDI = location.search.indexOf('mockMidi=1') >= 0;

@Component({
  selector: 'app-nugget-editor',
  templateUrl: './nugget-editor.component.html',
  styleUrls: ['./nugget-editor.component.scss']
})
export class NuggetEditorComponent implements OnInit {
  readonly editorOptions = {
    theme: 'vs-dark',
    language: 'typescript',
    fontSize: 20
  };

  code = codeTemplate;
  editorReady = false;

  @ViewChild('codeRunner')
  frame: ElementRef<HTMLIFrameElement>;

  private model: monaco.editor.ITextModel;

  constructor(
    private mockMidiTrumpet: MockMidiTrumpetService,
    private ngZone: NgZone
  ) {
    if (MOCK_MIDI) {
      mockMidiTrumpet.init();
    }
  }

  ngOnInit() {}

  editorLoaded(editor: monaco.editor.ICodeEditor) {
    this.model = editor.getModel();
    this.model.updateOptions({ tabSize: 2 });
    this.ngZone.run(() => {
      this.editorReady = true;
    });
  }

  async runCode() {
    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const client: LanguageService = await worker(this.model.uri);
    const result = await client.getEmitOutput(this.model.uri.toString());
    const compiledCode = result.outputFiles[0].text;

    const iframe = this.frame.nativeElement;
    iframe.src = 'about:blank';
    const frameWindow = iframe.contentWindow;
    const scriptElement = frameWindow.document.createElement('script');
    iframe.onload = () => {
      scriptElement.type = 'text/javascript';
      if (MOCK_MIDI) {
        (frameWindow.navigator as any).requestMIDIAccess = this.mockMidiTrumpet.createMockMidiTrumpet();
      }
      scriptElement.innerHTML += compiledCode;
      frameWindow.document.head.appendChild(scriptElement);
    };
  }
}
