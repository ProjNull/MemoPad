import { TestBed } from '@angular/core/testing';

import { MemopadManagerService } from './memopad-manager-service';

describe('MemopadManagerService', () => {
  let service: MemopadManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemopadManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
