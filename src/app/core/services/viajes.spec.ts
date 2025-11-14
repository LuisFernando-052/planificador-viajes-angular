import { TestBed } from '@angular/core/testing';

import { Viajes } from './viajes';

describe('Viajes', () => {
  let service: Viajes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Viajes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
