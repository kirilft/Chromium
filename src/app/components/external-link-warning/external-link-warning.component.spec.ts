import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLinkWarningComponent } from './external-link-warning.component';

describe('ExternalLinkWarningComponent', () => {
  let component: ExternalLinkWarningComponent;
  let fixture: ComponentFixture<ExternalLinkWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalLinkWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalLinkWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
