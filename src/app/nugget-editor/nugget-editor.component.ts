import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { LanguageService } from 'typescript';
import { codeTemplate } from '../code-template';
import { MockMidiTrumpetService } from '../mock-midi-trumpet.service';
import { NuggetService } from '../nugget.service';

const MOCK_MIDI = location.search.indexOf('mockMidi=1') >= 0;

@Component({
  selector: 'app-nugget-editor',
  templateUrl: './nugget-editor.component.html',
  styleUrls: ['./nugget-editor.component.scss']
})
export class NuggetEditorComponent implements OnInit, OnDestroy {
  readonly editorOptions = {
    theme: 'vs-dark',
    language: 'typescript',
    fontSize: 20
  };

  nuggetId: string | null = null;
  code = '';
  editorReady = false;

  @ViewChild('codeRunner')
  frame: ElementRef<HTMLIFrameElement>;

  destroy$ = new Subject<void>();

  private model: monaco.editor.ITextModel;

  constructor(
    private mockMidiTrumpet: MockMidiTrumpetService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    nuggetService: NuggetService
  ) {
    if (MOCK_MIDI) {
      mockMidiTrumpet.init();
    }
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(({ id }) => nuggetService.nugget(id))
      )
      .subscribe(nuggetInfo => {
        console.log(nuggetInfo);
        if (nuggetInfo) {
          const { id, code } = nuggetInfo;
          this.nuggetId = id;
          this.code = code;
        } else {
          this.nuggetId = null;
          this.code = codeTemplate;
        }
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
  }

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
