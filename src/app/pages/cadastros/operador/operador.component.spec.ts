import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { OperadorComponent } from './operador.component';

describe('OperadorComponent', () => {
  let component: OperadorComponent;
  let fixture: ComponentFixture<OperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperadorComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
