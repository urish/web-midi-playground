import { Component, OnInit } from '@angular/core';
import { codeTemplate } from '../code-template';
@Component({
  selector: 'app-nugget-editor',
  templateUrl: './nugget-editor.component.html',
  styleUrls: ['./nugget-editor.component.scss']
})
export class NuggetEditorComponent implements OnInit {
  readonly editorOptions = {
    theme: 'vs-dark',
    language: 'javascript'
  };
  code = codeTemplate;

  constructor() {}

  ngOnInit() {}
}
