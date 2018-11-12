import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockMidiTrumpetService {
  mockSynthIframe: HTMLIFrameElement | null = null;
  mockSynthLoaded: Promise<void> | null = null;

  init() {
    if (!this.mockSynthIframe) {
      this.mockSynthIframe = document.createElement('iframe');
      this.mockSynthLoaded = new Promise((resolve, reject) => {
        const iframe = this.mockSynthIframe;
        iframe.style.display = 'none';
        iframe.src = 'assets/trumpet-synth/';
        iframe.onload = () => resolve();
        iframe.onerror = reject;
        iframe.onabort = reject;
        document.body.appendChild(iframe);
      });
    }
  }

  createMockMidiTrumpet(): () => Promise<any> {
    this.init();

    const mockMidiTrumpet = {
      inputs: new Map(),
      outputs: new Map()
    };

    mockMidiTrumpet.outputs.set('default', {
      send: (msg: number, b1: number, b2: number) => {
        (this.mockSynthIframe.contentWindow as any).processMidiMessage(
          `M${msg},${b1},${b2}`
        );
      },
      name: 'Teensy MIDI MIDI 1'
    });

    return () => this.mockSynthLoaded.then(() => mockMidiTrumpet);
  }
}
