import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-project-audio',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class ProjectAudioComponent {}
