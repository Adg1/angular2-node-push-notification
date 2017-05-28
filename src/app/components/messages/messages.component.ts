import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from "socket.io-client";

import { Message } from '../../model/message/message';


@Component({
  selector: 'my-messages',
  templateUrl: './messages.component.html',
  styleUrls: [ './messages.component.css' ]
})
export class MessagesComponent implements OnInit {
  messages: Message[];

  socket = null;
  constructor(
    private router: Router) { }
  ngOnInit(): void {
    // this.getMessages();
    this.socket = io('http://localhost:3000');
    this.socket.emit('join', 'Hello World from client');
    this.socket.on('all_messages',(data) => {
        this.messages = data.messages;
    });
    this.socket.on('new_messages', (data) => {
        console.log(data.messages);
        let messagesToBeAdd: Message[] = [];
        console.log("new messages called");
        for (let i = 0; i < data.messages.length; i++) {
          let curData = data.messages[i];
          for(var j=0; j < this.messages.length; j++) {
            if (curData.id == this.messages[j].id) {
              this.messages[j] = curData;
              break;
            }
          }
          if (j == this.messages.length ) {
            messagesToBeAdd.push(data.messages[i])
          };
        }
        for (let k=0; k < messagesToBeAdd.length; k++) {
          this.messages.unshift(messagesToBeAdd[k]);
        }
    });
  }
  gotoDetail(message): void {
    this.router.navigate(['/detail', message.id]);
  }
}
