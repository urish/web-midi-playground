import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CodeRunnerService } from '../code-runner.service';
import { codeTemplate } from '../code-template';
import { NuggetService } from '../nugget.service';

@Component({
  selector: 'app-nugget-editor',
  templateUrl: './nugget-editor.component.html',
  styleUrls: ['./nugget-editor.component.scss']
})
export class NuggetEditorComponent implements OnInit, OnDestroy {
  readonly editorOptions: monaco.editor.IEditorConstructionOptions = {
    theme: 'vs-dark',
    automaticLayout: true,
    language: 'typescript',
    fontSize: 20,
    minimap: {
      enabled: false
    }
  };

  nuggetId: string | null = null;
  code = '';
  editorReady = false;
  showPreview = false;

  @ViewChild('codeRunner')
  frame: ElementRef<HTMLIFrameElement>;

  destroy$ = new Subject<void>();

  private model: monaco.editor.ITextModel;
  private activeDecorations: string[] = [];

  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private nuggetService: NuggetService,
    private router: Router,
    private codeRunnerService: CodeRunnerService
  ) {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(({ id }) => nuggetService.nugget(id))
      )
      .subscribe(nuggetInfo => {
        if (nuggetInfo) {
          const { id, code } = nuggetInfo;
          if (this.nuggetId !== id) {
            this.nuggetId = id;
            this.code = code;
          }
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

  private clearDecorations(editor: monaco.editor.IStandaloneCodeEditor) {
    this.activeDecorations = editor.deltaDecorations(
      this.activeDecorations,
      []
    );
  }

  editorLoaded(editor: monaco.editor.IStandaloneCodeEditor) {
    this.model = editor.getModel();
    this.model.updateOptions({ tabSize: 2 });
    this.ngZone.run(() => {
      this.editorReady = true;
    });

    editor.addAction({
      id: 'save',
      label: 'Save',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S // tslint:disable-line
      ],
      run: () => this.saveCode()
    });

    editor.addAction({
      id: 'run',
      label: 'Run',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, // tslint:disable-line
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R, // tslint:disable-line
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.F5 // tslint:disable-line
      ],
      run: () => monaco.Promise.wrap(this.runCode())
    });

    this.codeRunnerService.highlight$
      .pipe(takeUntil(this.destroy$))
      .subscribe(highlight => {
        if (!highlight.range) {
          this.clearDecorations(editor);
          return;
        }

        const [startLine, startCol, endLine, endCol] = highlight.range;
        const range = new monaco.Range(startLine, startCol, endLine, endCol);
        editor.revealRange(range);
        this.activeDecorations = editor.deltaDecorations(
          this.activeDecorations,
          [
            {
              range,
              options: { inlineClassName: 'editor-running-line-highlight' }
            }
          ]
        );
        console.log(this.activeDecorations);
      });
  }

  saveCode() {
    const name = prompt('Enter name?');
    if (name) {
      this.nuggetId = name;
      this.nuggetService.save(this.nuggetId, this.code);
      this.router.navigate(['nuggets', this.nuggetId]);
    }
  }

  async runCode() {
    if (this.nuggetId) {
      this.nuggetService.updatePlayCount(this.nuggetId);
    }
    await this.codeRunnerService.transpileAndRun(
      this.model,
      this.frame.nativeElement
    );
  }
}
