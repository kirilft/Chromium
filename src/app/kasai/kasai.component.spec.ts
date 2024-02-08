import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KasaiComponent } from './kasai.component';

describe('KasaiComponent', () => {
  let component: KasaiComponent;
  let fixture: ComponentFixture<KasaiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KasaiComponent]
    });
    fixture = TestBed.createComponent(KasaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
