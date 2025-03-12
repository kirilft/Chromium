import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KasaiComponent } from './kasai.component';

describe('KasaiComponent', () => {
  let component: KasaiComponent;
  let fixture: ComponentFixture<KasaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KasaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KasaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
