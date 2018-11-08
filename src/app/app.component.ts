import { Component } from '@angular/core';
import 'codemirror/mode/javascript/javascript';
import { codeTemplate } from './code-template';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly codemirrorOptions = {
    lineNumbers: true,
    theme: 'material',
    mode: { name: 'javascript', typescript: true }
  };

  code = codeTemplate;
}
