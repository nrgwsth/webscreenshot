"use strict";

let screenshot_id = 0;

var express = require('express');

var app = express();

var bodyParser = require("body-parser");

var exphbs = require("express-handlebars");

const server = require("http").createServer(app);

var io = require("socket.io")(server);

var webshot = require('webshot');

var path = require("path");

const domain = "https://takescreenshot.herokuapp.com";

const fs = require("fs");

app.engine("handlebars", exphbs({defaultLayout: "main"}));

app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + process.env.PORT || 3000);
});

let url;
io.on("connection", function(socket){
  socket.on("take screenshot", function(data){
    console.log(data.url);
    
    screenshot_id += 1;

    var filePath = path.resolve(__dirname, "./public/screenshots/screenshot" +screenshot_id+".png");
  
    webshot(data.url, filePath, function(err) {
      // screenshot now saved to google.png
      url = domain + "screenshots/" + "screenshot" + screenshot_id + ".png";
      if(!err){
        socket.emit("screenshot done", url);
        setTimeout(function(){
          fs.unlink(filePath, (err)=>{
            if(err) throw err;
            console.log('successfully deleted ' + filePath);
          })
        }, 60000*5);
      } else{
        socket.emit("screenshot error", null);
        console.log(err);
      }
    });
  });
});