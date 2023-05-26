import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaymaxComponent } from './baymax.component';

describe('BaymaxComponent', () => {
  let component: BaymaxComponent;
  let fixture: ComponentFixture<BaymaxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaymaxComponent]
    });
    fixture = TestBed.createComponent(BaymaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
