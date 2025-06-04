/* theme.service.spec.ts*/
import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { ConsentService } from './consent.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let consentServiceMock: jasmine.SpyObj<ConsentService>;

  beforeEach(() => {
    consentServiceMock = jasmine.createSpyObj('ConsentService', ['hasConsent']);
    consentServiceMock.hasConsent.and.returnValue(false);
    TestBed.configureTestingModule({
      providers: [{ provide: ConsentService, useValue: consentServiceMock }],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme and emit change', () => {
    const initialTheme = service.currentTheme;
    let emittedTheme: 'light' | 'dark' | undefined;
    service.themeChanged.subscribe((theme) => (emittedTheme = theme));

    service.toggleTheme();

    expect(service.currentTheme).not.toBe(initialTheme);
    expect(emittedTheme).toBe(service.currentTheme);
  });
});
