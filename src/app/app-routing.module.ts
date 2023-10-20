import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { MainComponent } from './main/main.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyAndTermsComponent } from './privacy-and-terms/privacy-and-terms.component';
import { SettingsComponent } from './settings/settings.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'loading', component: LoadingComponent },
  { path: 'main', component: MainComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'privacy-and-terms', component: PrivacyAndTermsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
