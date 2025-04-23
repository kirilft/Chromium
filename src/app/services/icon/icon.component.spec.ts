import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser'; // Import By for querying elements

import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let imgElement: HTMLImageElement;

  // Configure the testing module before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent] // Import the standalone component
    })
    .compileComponents(); // Compile the component's template and CSS

    // Create a component fixture (wrapper for component and template)
    fixture = TestBed.createComponent(IconComponent);
    // Get the component instance
    component = fixture.componentInstance;

    // Set required input before initial change detection
    component.name = 'test-icon'; // Provide a default test name
    component.alt = 'Test Alt Text'; // Provide default alt text

    // Trigger initial data binding
    fixture.detectChanges();

    // Get the img element for assertions
    imgElement = fixture.debugElement.query(By.css('img.icon')).nativeElement;
  });

  // Test case 1: Ensure the component creates successfully
  it('should create', () => {
    expect(component).toBeTruthy(); // Assert that the component instance exists
  });

  // Test case 2: Ensure the iconUrl is generated correctly
  it('should generate the correct iconUrl based on the name input', () => {
    component.name = 'sun'; // Change the input name
    fixture.detectChanges(); // Trigger change detection
    // Assert that the getter produces the expected URL
    expect(component.iconUrl).toBe('assets/icons/sun.svg');
    // Assert that the img src attribute is updated
    expect(imgElement.src).toContain('assets/icons/sun.svg');
  });

  // Test case 3: Ensure the alt text is applied correctly
  it('should apply the alt text to the img element', () => {
    const testAlt = 'Alternative text for sun icon';
    component.alt = testAlt; // Change the alt text input
    fixture.detectChanges(); // Trigger change detection
    // Assert that the img alt attribute matches the input
    expect(imgElement.alt).toBe(testAlt);
  });

  // Test case 4: Ensure default alt text is used if none provided
  it('should use default alt text if none is provided', () => {
     // Recreate component without setting alt initially (or set to undefined)
     fixture = TestBed.createComponent(IconComponent);
     component = fixture.componentInstance;
     component.name = 'moon';
     // component.alt = undefined; // Explicitly undefined or just don't set it
     fixture.detectChanges();
     imgElement = fixture.debugElement.query(By.css('img.icon')).nativeElement;

     // Assert that the default alt text "Icon" is used
     expect(imgElement.alt).toBe('Icon');
  });

  // Test case 5: Ensure the required name input is handled (optional, Angular handles this at compile time mostly)
   it('should have name input marked as required', () => {
     // This test mainly verifies the decorator presence conceptually,
     // as runtime checks for required inputs are less common in unit tests.
     // We rely on TypeScript and Angular's template compiler for this.
     const inputs = component.constructor.prototype.constructor.propDecorators.name[0].args[0];
     expect(inputs.required).toBeTrue();
   });

});
