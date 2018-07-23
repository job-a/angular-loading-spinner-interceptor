import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeldingComponent } from './melding.component';

describe('MeldingComponent', () => {
  let component: MeldingComponent;
  let fixture: ComponentFixture<MeldingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeldingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeldingComponent);
    component = fixture.componentInstance;
    component.bericht = '';
    component.type = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
