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
    fontSize: 20,
  };
  code = codeTemplate;

  @ViewChild('codeRunner') frame: ElementRef<HTMLIFrameElement>;

  constructor() {}

  ngOnInit() {}

  async runCode() {
    const model = monaco.editor.getModels()[0];
    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const client: LanguageService = await worker(model.uri);
    const result = await client.getEmitOutput(model.uri.toString());
    const compiledCode = result.outputFiles[0].text;

    const frameWindow = this.frame.nativeElement.contentWindow;
    frameWindow.location.href = '/assets/empty.html';
    const scriptElement = frameWindow.document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.innerHTML = compiledCode;
    frameWindow.document.head.appendChild(scriptElement);
  }
}
