import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <img [attr.src]="iconUrl" [alt]="alt" class="icon" />
  `,
  styles: [
    `
      .icon {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class IconComponent {
  @Input() name!: string;
  @Input() alt: string = '';

  get iconUrl(): string {
    return `./assets/icons/${this.name}.svg`;
  }
}
