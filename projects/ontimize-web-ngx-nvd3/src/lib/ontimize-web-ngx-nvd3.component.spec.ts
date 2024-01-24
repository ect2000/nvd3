import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { nvD3 } from './ontimize-web-ngx-nvd3.component';

describe('OntimizeWebNgxNvd3Component', () => {
  let component: nvD3;
  let fixture: ComponentFixture<nvD3>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ nvD3 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(nvD3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
