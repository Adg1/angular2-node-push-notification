# Push Notification App

This is a push notification web app built on Angular2, Node, Mysql and SocketIO.

## Getting Started

This app requires you to have "npm", "angular-cli", "mysql", "sequelize" and "node" npm modules installed globally on your machine. Then you can clone the repo and run the following in root folder:
Create a mysql database "cloudsek".
To create table "Messages", run
```
sequelize db:migrate
```
sequelize doesn't create the table for default values. Run the following "SQL" command in mysql workbench to alter the table

```
ALTER TABLE `cloudsek`.`Messages` CHANGE COLUMN `createdAt` `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ;
```

Now,
```
npm install
```
```
ng build
```

## Running the app

Run the following command which will host the app at localhost port 3000.
```
node server.js
```
Note:
Make sure that the mysql timezone is same as the timezone while inserting the row manually.
