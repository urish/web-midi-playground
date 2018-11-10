import { TestBed } from '@angular/core/testing';

import { CodeRunnerService } from './code-runner.service';

describe('CodeRunnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodeRunnerService = TestBed.get(CodeRunnerService);
    expect(service).toBeTruthy();
  });
});
