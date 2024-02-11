// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module'; // Import SharedModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// Import other components

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    // Other components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule // Import SharedModule here
    // Other modules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
