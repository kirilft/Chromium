import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlauwalComponent } from './blauwal.component';

describe('BlauwalComponent', () => {
  let component: BlauwalComponent;
  let fixture: ComponentFixture<BlauwalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlauwalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlauwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
