import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OddityComponent } from './oddity.component';

describe('OddityComponent', () => {
  let component: OddityComponent;
  let fixture: ComponentFixture<OddityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OddityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OddityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
