import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-project-color',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ProjectColorComponent {}
