

const uri ="mongodb+srv://yassine:123698745@cluster0.yr2lt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//"mongodb+srv://yassine:123698745@cluster0.yr2lt.mongodb.net/emu8086?retryWrites=true&w=majority";
const connect = require('./db/connect.js');
dashboard = require ('./routes/dashboard.js');
general = require ('./routes/general.js');
const express = require('express');
const server = express();
const path = require('path');
const session = require('express-session');
const flash = require('req-flash');
const WebSocket = require('ws');
const port = 8000;
server.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
     maxAge:60000*60*24,
     }
}))
server.use(flash());
server.use(express.static(path.join(__dirname, 'static')));

server.use(express.urlencoded( { extended:false } ));

server.set('view engine',"ejs");
server.use('/',general);

server.use('/dashboard',dashboard);

const wss = new WebSocket.Server({ noServer: true });
const clientsx={};
const admin=[];
let recive=true;
//const std = require('./steudent.js');

const std=[["mohamed"," 2"],["yassine","2"],["idris","4"],["sdl","4"],["yanis","4"],["kamel","2"]]
var isJsonParsable = string => {
 
  try {
  JSON. parse(string);
  } catch (e) {
  return false;
  }
  return true;
  }
  setTimeout(()=>{setInterval( ()=>
    {  
    if(true || recive)
    {
    console.log((Object.keys(clientsx))); 
    for (id in clientsx) {  
      if (Object.hasOwnProperty.call(clientsx, id)) {
        const element = clientsx[id];
        if (!element.name) continue;
        let d= new Date;
        d=(d.getTime())-(element.last);  
        console.log(d+"  "+element.name+"  "+id+" ");
      if ((d > 25000)){
              
            for (let index = 0; index < admin.length; index++) {
              const element1 = admin[index];
              if (element1)
                  element1.connection.send(JSON.stringify({"name":element.name,"method":"@has disconected@"}))       
            }
           
            delete clientsx[id];
       }
        
      }
    }
  }
},10000)},5000);
wss.on('connection', function connect(ws) {
 
  if(!recive){
    ws.send(JSON.stringify({
      "method":"the live is off"
    }))
    return;
  }
  

  
  const clientId = guid(); //guid is function generat random id
  
  clientsx[clientId] = {
      "connection": ws,
      "name":"",
      "last": new Date
  }
  // optimiziha later*******************************
  const payLoad = {
    "method": "hello",
    "clientId": clientId
  }

  // test it -----------------------------------
  if (Object.keys(clientsx).length > 60) payLoad.method="the room is full";
  //send back the client connect id
  ws.send(JSON.stringify(payLoad))
  
  ws.on('message', function incoming(data) {

    console.log(data)
    if ( isJsonParsable(data)){
      // the data is life cheak or an admin login
      let obj = JSON.parse(data);
      if (recive && obj.method=="the live"){
      // data base later ....
      let name=obj.name.split('\n').shift().trim();
      let group=obj.name.split("\n").pop().trim();
      let tmp=false;

     for (let index = 0; index < std.length; index++) {
        const element = std[index];
 
        if (element[0]==name.toLowerCase() && element[1]==group.toLowerCase()){
          tmp=true;
          break;
        }
       
      }

     if (!tmp){ws.send((JSON.stringify({"method":"wrongName","name":obj.name,})))}
      
      else if (Object.hasOwnProperty.call(clientsx,obj.fakeId ) )
      clientsx[obj.fakeId].name=obj.name
        if (Object.hasOwnProperty.call(clientsx,obj.clientId ) && Object.hasOwnProperty.call(clientsx,obj.fakeId))
     { 
      //let x=obj.clientId
     // clientsx[x]={};
      clientsx[obj.clientId].connection=clientsx[obj.fakeId].connection;
     // clientsx[obj.clientId].name=obj.name;
      clientsx[obj.clientId].last=new Date;
      delete  clientsx[obj.fakeId];
      ws.send(JSON.stringify({"method":"idUpdate","clientId":obj.clientId}))
         }
          
      else {
        let exist=false;
       for (const key in clientsx) {
         if (Object.hasOwnProperty.call(clientsx, key)) {
           const element = clientsx[key];
     
           if (element.name===obj.name && key!=obj.clientId && key!=obj.fakeId){
            exist=true
          break;
          }  
          
           
         }
        }
       if(!(Object.hasOwnProperty.call(clientsx,obj.clientId )) && obj.clientId!=null)
       {
        ws.send(JSON.stringify({"method":"stay","fakeId":obj.fakeId}))
       
       }
       if (exist) {
        if (Object.hasOwnProperty.call(clientsx,obj.clientId ) )
         delete clientsx[obj.clientId];
         if (Object.hasOwnProperty.call(clientsx,obj.fakeId ) )
         delete clientsx[obj.fakeId]
         
         delete clientsx[obj.clientId];
         ws.send(JSON.stringify({"method":"already in","clientId":obj.clientId,"fakeId":obj.fakeId}))
       }
      }
       
      }
      else if (recive && obj.method==="a life"){
       if (clientsx[obj.clientId]!=undefined){
        clientsx[obj.clientId].last =obj.last;
       }
      }
      else if (obj.method==="admin"){
        if (Object.hasOwnProperty.call(clientsx,obj.clientId ) ){
         admin.push(clientsx[obj.clientId]);
         delete clientsx[obj.clientId];
       }
        for (const key in clientsx) {
          if (Object.hasOwnProperty.call(clientsx, key)) {
            const element = clientsx[key];
            element.connection.send(JSON.stringify({
              "method":"requestAll",
            }))
            
          }
        }
      }
      else if (recive && obj.method=="code") {
       console.log(" the data is a code object");
      
        for (let index = 0; index < admin.length; index++) {
          const element1 = admin[index];
    
          if (element1)  element1.connection.send(data)       
        }
  
      }
      else if(recive && obj.method=="requestAll"){
         
         
      
        for (const key in clientsx) {
          if (Object.hasOwnProperty.call(clientsx, key)) {
            const element = clientsx[key];
            element.connection.send(JSON.stringify({
              "method":"requestAll",
            }))
            
          }
        }
      }
      else if(obj.method=="deletion"){

        
        delete clientsx[obj.clientId];
       for (let index = 0; index < admin.length; index++) {
          const element1 = admin[index];
          if (element1)
              element1.connection.send(JSON.stringify({"name":obj.name,"method":"@has disconected@"}))       
        }
      
      }
      else if(obj.method=="stop"){
        recive=false;
        for (const key in clientsx) {
          if (Object.hasOwnProperty.call(clientsx, key)) {
            const element = clientsx[key];
            element.connection.send(JSON.stringify({
              "method":"the live is off"
            }))
            
          }
        }
       
      }
      else if(obj.method=="come"){
        recive=true;
      }

      
    }

  })
}

)

start = async ()=> {
  try {

    await connect(
        uri, { useNewUrlParser: true, useUnifiedTopology: true }
        )
        const app = server.listen(port);
        app.on('upgrade', (request, socket, head) => {
          wss.handleUpgrade(request, socket, head, socket => {
            wss.emit('connection', socket, request);
          });
        });
              
  } catch (error) {
     console.log(error); 
  } 

}
start();


function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
//400+1150+100+750+1270+520+810+3400+320+120+250+130+460+1350+50+100+270
//3400+320+120+250+130+460+1350+50+100+270

















