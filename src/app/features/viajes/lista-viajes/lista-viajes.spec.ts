import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaViajes } from './lista-viajes.component';

describe('ListaViajes', () => {
  let component: ListaViajes;
  let fixture: ComponentFixture<ListaViajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaViajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaViajes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
