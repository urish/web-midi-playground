import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatBadgeModule,
  MatChipsModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NuggetEditorComponent } from './nugget-editor/nugget-editor.component';
import { NuggetListComponent } from './nugget-list/nugget-list.component';
import { webMidiTypes } from './web-midi-types';
import { webBluetoothTypes } from './web-bluetooth-types';

export function onMonacoLoad() {
  // This makes Web MIDI APIs available in the editor
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    webMidiTypes,
    'webmidi.d.ts'
  );

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    webBluetoothTypes,
    'web-bluetooth.d.ts'
  );
}

@NgModule({
  declarations: [AppComponent, NuggetListComponent, NuggetEditorComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MonacoEditorModule.forRoot({ onMonacoLoad }),
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    LayoutModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatChipsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
