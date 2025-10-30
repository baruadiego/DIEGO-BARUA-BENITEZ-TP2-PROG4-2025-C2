import { TestBed } from '@angular/core/testing';

import { Toastify } from './toastify';

describe('Toastify', () => {
  let service: Toastify;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Toastify);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
