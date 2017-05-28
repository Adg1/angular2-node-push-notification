import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from "socket.io-client";

import { Message } from '../../model/message/message';


@Component({
  selector: 'messages-status',
  template: `
    <nav>
      <a routerLink="/messages">Inbox {{notificationText !== '' ?
        '(' + notificationText +')' : ''}}</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: [ './messages-status.component.css' ]
})
export class MessagesStatusComponent implements OnInit {
  unReadMessages: number;
  notificationText: string = "";
  socket = null;
  ngOnInit(): void {
    // this.getMessages();
    this.socket = io('http://localhost:3000');
    this.socket.emit('join', 'Hello World from client');
    this.socket.on('unread_count',(data) => {
      console.log("unread called");
      this.unReadMessages = Number(data.unread);
      this.notificationText = this.unReadMessages > 0 ? this.unReadMessages
        + ' unread messages' : '';

    });
  }
}
