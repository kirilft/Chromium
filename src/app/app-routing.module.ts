// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { 
    path: 'main', 
    loadChildren: () => import('./main/main.module').then(m => m.MainModule) 
  },
  { 
    path: 'kasai', 
    loadChildren: () => import('./kasai/kasai.module').then(m => m.KasaiModule) 
  },
  { 
    path: '', 
    redirectTo: '/main', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    component: PageNotFoundComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
