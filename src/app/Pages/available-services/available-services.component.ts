import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-available-services',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './available-services.component.html',
  styleUrls: ['./available-services.component.css']
})
export class AvailableServicesComponent implements OnInit, AfterViewInit {
  links: { title: string; url: string }[] = [
    { title: 'NGINX Proxy Manager',  url: 'https://npm.kiriwstd.com' },
    { title: 'OPNsense',             url: 'https://opn.kiriwstd.com' },
    { title: 'Proxmox',              url: 'https://pve.kiriwstd.com' },
    { title: 'Speedtest',            url: 'https://speed.kiriwstd.com' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // initialize if needed
  }

  ngAfterViewInit(): void {
    // Guard DOM access for SSR
    if (!isPlatformBrowser(this.platformId)) return;

    const elems = document.getElementsByClassName('link');
    for (const el of Array.from(elems) as HTMLElement[]) {
      el.onmousemove = (e: MouseEvent) => {
        const decimal = e.clientX / el.offsetWidth;
        const basePercent = 80;
        const percentRange = 20;
        const adjustablePercent = percentRange * decimal;
        el.style.setProperty('--light-blue-percent', `${basePercent + adjustablePercent}%`);
      };
    }
  }
}
