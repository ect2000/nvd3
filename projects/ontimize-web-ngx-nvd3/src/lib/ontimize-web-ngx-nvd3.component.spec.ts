import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Nvd3 } from './ontimize-web-ngx-nvd3.component';

describe('OntimizeWebNgxNvd3Component', () => {
  let component: Nvd3;
  let fixture: ComponentFixture<Nvd3>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Nvd3 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Nvd3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
