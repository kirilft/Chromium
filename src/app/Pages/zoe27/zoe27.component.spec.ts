import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zoe27Component } from './zoe27.component';

describe('Zoe27Component', () => {
  let component: Zoe27Component;
  let fixture: ComponentFixture<Zoe27Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zoe27Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zoe27Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
