import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-project-astrophotography',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './astrophotography.component.html',
  styleUrls: ['./astrophotography.component.css']
})
export class ProjectAstrophotographyComponent {}
