import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViaje } from './form-viaje.component';

describe('FormViaje', () => {
  let component: FormViaje;
  let fixture: ComponentFixture<FormViaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViaje]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormViaje);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
