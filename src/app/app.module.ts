import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }         from './app.component';
import { MessagesComponent }      from './components/messages/messages.component';
import { MessageDetailComponent }  from './components/message-detail/message-detail.component';
import { MessagesStatusComponent }  from './components/messages-status/messages-status.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MessageDetailComponent,
    MessagesComponent,
    MessagesStatusComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
