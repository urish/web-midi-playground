import { Component, OnInit } from '@angular/core';
import { codeTemplate } from '../code-template';
import 'codemirror/mode/javascript/javascript';

@Component({
  selector: 'app-nugget-editor',
  templateUrl: './nugget-editor.component.html',
  styleUrls: ['./nugget-editor.component.scss']
})
export class NuggetEditorComponent implements OnInit {
  readonly codemirrorOptions = {
    lineNumbers: true,
    theme: 'material',
    mode: { name: 'javascript', typescript: true }
  };

  code = codeTemplate;

  constructor() { }

  ngOnInit() {
  }

}
