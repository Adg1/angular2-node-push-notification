import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent }      from './components/messages/messages.component';
import { MessageDetailComponent }  from './components/message-detail/message-detail.component';
const routes: Routes = [
  { path: '', redirectTo: '/messages', pathMatch: 'full' },
  { path: 'detail/:id', component: MessageDetailComponent },
  { path: 'messages',     component: MessagesComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
