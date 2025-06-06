import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

interface ServiceEntry {
  label: string;
  url: string;
  hostOnly?: string;
  isOnline: boolean | null;
}

@Component({
  selector: 'app-kasai',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './kasai.component.html',
  styleUrls: ['./kasai.component.css']
})
export class KasaiComponent implements OnInit {
  networking: ServiceEntry[] = [
    {
      label: 'Router (OpenWRT)',
      url: 'https://opn.kiriwstd.com',
      hostOnly: 'opn.kiriwstd.com',
      isOnline: null
    },
    {
      label: 'Nginx Proxy Manager',
      url: 'https://npm.kiriwstd.com',
      hostOnly: 'npm.kiriwstd.com',
      isOnline: null
    }
  ];

  proxmox: ServiceEntry[] = [
    {
      label: 'Proxmox VE',
      url: 'https://pve.kiriwstd.com',
      hostOnly: 'pve.kiriwstd.com',
      isOnline: null
    }
  ];

  // No clients defined yet (will show fallback “No clients defined.”)
  clients: ServiceEntry[] = [];

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof window.Image !== 'undefined') {
      [...this.networking, ...this.proxmox, ...this.clients]
        .forEach(svc => this.checkHost(svc));
    } else {
      // SSR or Node environment: mark everything offline (or leave null if you prefer)
      this.networking.forEach(svc => svc.isOnline = false);
      this.proxmox.forEach(svc => svc.isOnline = false);
      this.clients.forEach(svc => svc.isOnline = false);
    }
  }

  private checkHost(entry: ServiceEntry) {
    if (!entry.hostOnly) {
      entry.isOnline = false;
      return;
    }

    const img = new Image();
    img.src = `https://${entry.hostOnly}/favicon.ico?cb=${Date.now()}`;

    img.onload = () => entry.isOnline = true;
    img.onerror = () => entry.isOnline = false;

    setTimeout(() => {
      if (entry.isOnline === null) {
        entry.isOnline = false;
      }
    }, 5000);
  }
}
