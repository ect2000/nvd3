import { TestBed } from '@angular/core/testing';

import { OntimizeWebNgxNvd3Service } from './ontimize-web-ngx-nvd3.service';

describe('OntimizeWebNgxNvd3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OntimizeWebNgxNvd3Service = TestBed.get(OntimizeWebNgxNvd3Service);
    expect(service).toBeTruthy();
  });
});
