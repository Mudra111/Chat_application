import { TestBed } from '@angular/core/testing';

import { PwaPromptService } from './pwa-prompt.service';

describe('PwaPromptService', () => {
  let service: PwaPromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaPromptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
