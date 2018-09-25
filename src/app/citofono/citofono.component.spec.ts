import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitofonoComponent } from './citofono.component';

describe('CitofonoComponent', () => {
  let component: CitofonoComponent;
  let fixture: ComponentFixture<CitofonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitofonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitofonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
