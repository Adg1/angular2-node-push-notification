import { Component } from '@angular/core';

import { MessagesStatusComponent } from './components/messages-status/messages-status.component';


@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <messages-status></messages-status>
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  title = 'Notifications';
}
