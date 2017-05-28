'use strict'

const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const Message = require('./server/models').Message;
var server = http.createServer(app);
var io = require('socket.io')(server);

var connectionsArray = [];
var POLLING_INTERVAL = 1000;
var previous_unread_count;
var last_poll = new Date('1970-01-01');

console.log(__dirname);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  //res.send("Hello World!");
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

function pollNewMessages() {
  Message.max('updatedAt').then(maxUpdatedAt => {
    if (!maxUpdatedAt) {
      console.log("No messages added yet!");
      setTimeout(pollNewMessages, POLLING_INTERVAL);
      return;
    }
    var previous_last_poll = new Date(last_poll.getTime());
    last_poll = maxUpdatedAt;
    console.log("Previous polled upto: " + previous_last_poll);
    console.log("Current polled upto: " + last_poll);
    //Emit all msgs summary
    Message.findAll({
      attributes: ['id', 'summary', 'read', 'createdAt'],
      where: {
        updatedAt: {
          $lte: maxUpdatedAt,
          $gt: previous_last_poll
        }
      },
      order: [
        ['createdAt', 'DESC']
      ]
    }).then(messages => {
      console.log("New messages count : " + messages.length);
      messages.length > 0 ?
        updateClientsMessages(messages) : console.log("No new messages to pass");
    }).catch(error => {
      console.log("Error fetching new messages : " + error)
    })

    //Emit unread msg count
    Message.count({
      where: {
        createdAt: {
          $lte: maxUpdatedAt
        },
        read: 0
      },
    }).then(unreadCount => {
      console.log("Unread count : " + unreadCount);
      unreadCount != previous_unread_count ?
        updateClientsUnreadCount(unreadCount) : console.log("Unread count is same");
      previous_unread_count = unreadCount;
    }).catch(error => {
      console.log("Error fetching unread_count : " + error)
    })

    //Set up poll gain with timer
    setTimeout(pollNewMessages, POLLING_INTERVAL);
  })
};

pollNewMessages()

var updateClientsMessages = function(data) {
  console.log(`Pushing ${data.length} new messages to the clients connected
    ( connections amount = ${connectionsArray.length} ) - ${last_poll}`);
  // sending new data to all the sockets connected
  connectionsArray.forEach(function(tmpSocket) {
    console.log("new message emitted");
    tmpSocket.emit('new_messages', {
      messages: data
    });
  });
};

var updateClientsUnreadCount = function(data) {
  console.log(`Updating unread count ${data} to the clients connected
    ( connections amount = ${connectionsArray.length} ) - ${last_poll}`);
  // sending new data to all the sockets connected
  connectionsArray.forEach(function(tmpSocket) {
    tmpSocket.emit('unread_count', {
      unread: data
    });
  });
};

io.on('connection', function(client) {
  console.log('Client connected...');
  //When any client joins we return all messages and unread count upto last_poll
  client.on('join', function(data) {

    //Emit all msgs summary
    Message.findAll({
      attributes: ['id', 'summary', 'read', 'createdAt'],
      where: {
        updatedAt: {
          $lte: last_poll
        }
      },
      order: [
        ['createdAt', 'DESC']
      ]
    }).then(messages => {
      // console.log("All messages count : " + messages.length)
      client.emit("all_messages", {
        messages: messages
      })
    }).catch(error => {
      console.log("Error fetching all messages : " + error)
    })

    //Emit unread msg count
    Message.count({
      where: {
        createdAt: {
          $lte: last_poll
        },
        read: 0
      },
    }).then(unreadCount => {
      // console.log("Unread count : " + unreadCount)
      client.emit("unread_count", {
        unread: unreadCount
      })
    }).catch(error => {
      console.log("Error fetching all messages : " + error)
    })
  });

  //Remove client from connectionsArray
  client.on('disconnect', function() {
    var socketIndex = connectionsArray.indexOf(client);
    // console.log('socketID = %s got disconnected', socketIndex);
    if (~socketIndex) {
      connectionsArray.splice(socketIndex, 1);
    }
  });

  //Add client to connectionsArray
  // console.log('A new client is connected!');
  connectionsArray.push(client);


  //New message
  client.on('create_new_message', function(data) {
    Message.create({
        summary: data.message.summary,
        content: data.message.content
      }).then(message => console.log(`New message ${message.id} successfully saved!`))
      .catch(error => console.log(`Error saving new message ${error}`));
  });

  //Message by Id request; Update read status & send
  client.on('message_id_req', function(data) {
    var id = data.id;
    // console.log("Message by Id: " + id);
    Message.findById(id)
      .then(message => message.update({
        read: true
      }))
      .then(updatedMessage => {
        client.emit("message_id_" + id, {
          message: updatedMessage
        })
      }).catch(error => console.log("Failed to respond with requested message!"));
  });

});

server.listen(3000, (err) => {
  if (!err) {
    console.log("Server started!");
  } else {
    console.log(err);
  }
});
