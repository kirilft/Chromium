import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-arc',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './arc.component.html',
  styleUrl: './arc.component.css'
})
export class ArcComponent {

}
