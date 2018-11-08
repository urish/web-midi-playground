import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LanguageService } from 'typescript';
import { codeTemplate } from '../code-template';

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

  @ViewChild('codeRunner')
  frame: ElementRef<HTMLIFrameElement>;

  private model: monaco.editor.ITextModel;

  constructor() {}

  ngOnInit() {}

  editorLoaded(editor: monaco.editor.ICodeEditor) {
    this.model = editor.getModel();
    this.model.updateOptions({ tabSize: 2 });
  }

  async runCode() {
    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const client: LanguageService = await worker(this.model.uri);
    const result = await client.getEmitOutput(this.model.uri.toString());
    const compiledCode = result.outputFiles[0].text;

    const frameWindow = this.frame.nativeElement.contentWindow;
    frameWindow.location.href = '/assets/empty.html';
    const scriptElement = frameWindow.document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.innerHTML = compiledCode;
    frameWindow.document.head.appendChild(scriptElement);
  }
}
