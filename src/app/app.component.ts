import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Chromium'
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {}

      ngOnInit() {
        const isFirstVisit = this.cookieService.check('firstVisit'); // either no or null
      
        if ('no' != this.cookieService.get('firstVisit')) {
          this.cookieService.set('firstVisit', 'no');
          this.router.navigate(['/loading']);
        }
      }    
}
