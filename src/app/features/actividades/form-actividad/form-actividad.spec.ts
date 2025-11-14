import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActividad } from './form-actividad.component';

describe('FormActividad', () => {
  let component: FormActividad;
  let fixture: ComponentFixture<FormActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormActividad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormActividad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
