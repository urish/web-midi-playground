import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NuggetListComponent } from './nugget-list/nugget-list.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NuggetEditorComponent } from './nugget-editor/nugget-editor.component';
import { CommonModule } from '@angular/common';
import { webMidiTypes } from './web-midi-types';

const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: () => {
    // This makes Web MIDI APIs available in the editor
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      webMidiTypes,
      'webmidi.d.ts'
    );
  }
};

@NgModule({
  declarations: [AppComponent, NuggetListComponent, NuggetEditorComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MonacoEditorModule.forRoot(monacoConfig),
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
