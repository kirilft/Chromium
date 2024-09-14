import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';


export const routes: Routes = [
  { path: 'head', component:HeaderComponent},
  { path: 'main', component: MainComponent }, // Changed from redirect to component
  { path: '', redirectTo: 'main', pathMatch: 'full' }, // Changed from component to redirect
  {path: '**', component: PageNotFoundComponent} // Changed from redirect to component
];

