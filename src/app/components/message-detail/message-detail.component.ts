import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { Message } from '../../model/message/message';

import * as io from "socket.io-client";

@Component({
  selector: 'message-detail',
  templateUrl: './message-detail.component.html'
})
export class MessageDetailComponent implements OnInit {
  message: Message;
  socket = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}
  goBack(): void {
    this.location.back();
  }
  getMessage(id: Number): void  {
    console.log("Get message: " + id);
    this.socket.emit('message_id_req', { id: id });
    this.socket.on('message_id_' + id, (data) => {
        this.message= data.message;
    });
  }
  ngOnInit(): void {
    this.socket = io('http://localhost:3000');
    this.socket.emit('join', 'Hello World from client');
    console.log(this.socket);
    let id  = this.route.snapshot.params['id'];
    this.getMessage(id);
  }

}
