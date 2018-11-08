import { TestBed } from '@angular/core/testing';

import { MockMidiTrumpetService } from './mock-midi-trumpet.service';

describe('MockMidiTrumpetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockMidiTrumpetService = TestBed.get(MockMidiTrumpetService);
    expect(service).toBeTruthy();
  });
});
