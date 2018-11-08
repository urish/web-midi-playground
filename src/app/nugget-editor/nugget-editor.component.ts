import { Component, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit() {}

  async runCode() {
    const model = monaco.editor.getModels()[0];
    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const client: LanguageService = await worker(model.uri);
    const result = await client.getEmitOutput(model.uri.toString());
    alert(result.outputFiles[0].text);
  }
}
