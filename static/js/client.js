

    let  butt=document.querySelector('#connect');
    
      let ws;
     var id;
     var wrong=false;
     var names;
       
       //get the last state of button connect/disconnect
       butt.checked=  localStorage.getItem("discon")==="true";
    
       if (butt.checked ) {
        connect();
      
        //butt.checked=true;

      }
       // assign the function discon to the event onclick
       butt.onclick= discon;
        function discon(){
         
       if (!butt.checked ){
        
        deleteme(localStorage.getItem("name"));
        wrong = true;
        localStorage.setItem("discon",false);
        return;
      }
       if (butt.checked )
      { 
         wrong=false;
         connect();
         localStorage.setItem("discon",true)
  
         return;
      }

    };
      function deleteme(x){
      ws.send(JSON.stringify({"method":"deletion","clientId":id,"name":x}));
  
      ws.close();
    }
    const isJsonParsable = string => {
          try {
          JSON. parse(string);
          } catch (e) {
          return false;
          }
          return true;
          }

    function connect() {
    //get the name of the steudent
    names=localStorage.getItem("name");
   
    function showMessage(message) {
      alert(message)
    }
    //if the steudent is not registed nothing will happen
    if (names){
      // connect to the server
      ws = new WebSocket('ws://localhost:8000');
      ws.onopen = () => {
        console.log('Connection opened!')
        //send code after 5 seconds
        setTimeout(sendCode,1000)
      };
      
      ws.onmessage = ({ data }) =>{
        console.log(data)
        //cheak if it is correct json form

        if (isJsonParsable(data)) {
          console.log(data);
          obj=JSON.parse(data)
          
          // the client is already registed from another place
          if(obj.method === "already in"){
            alert("u are already logged in form another place");
            wrong=true;
            return;
          }// the name of the student is wrong or does not exist 
          else if  (obj.method === "wrongName"){
            alert("u name is wrong or not in the list  \n please regite again ");
            wrong=true;
            butt.checked=false;
            return;
          }// the number of the student is more then 50
          else if  (obj.method === "the room is full"){
          wrong=true;
          butt.checked=false;
          showMessage(obj.method);
          return;
          }// change the id of the client to his old id(which was in cookies)
          else if  (obj.method === "idUpdate"){

            id=obj.clientId;
            return;
          }// keep your id the same
          else if  (obj.method === "stay"){

            id=obj.fakeId;
            localStorage.setItem("id",id);
            //alert("hi");
             
          }// the admin demand to sendcode
          else if  (obj.method === "requestAll"){
              //discon(true)
              sendCode();             
          }// the button live is disconnected 
          else if  (obj.method === "the live is off"){
            
            deleteme(localStorage.getItem("name"));
            wrong = true;
            
   
            localStorage.setItem("discon",false);
            butt.checked=false;
            //discon();           
          }// getting started and reciving the id
          else if  (obj.method === "hello"){
            id=obj.clientId;
            
            preid=localStorage.getItem("id");
            
            ws.send(JSON.stringify({"method":"the live","clientId":preid,"name":names,"fakeId":id}))
            
          }
        }
        else
           showMessage(data);
      }
     ws.onclose = function() {
         ws=null;
      }

      codeMirror.on('change', sendCode);

      function sendCode() {
            
          if (!ws || wrong ) {
            //showMessage("somthing goes wrong");
            return ;
          }
          ws.send(JSON.stringify({
            "method":"code",
            "code":codeMirror.getValue(),
            "name":names,
            "clientId":id
            }
            ));
        }
    
    let  payLoad 
    setInterval(function(){
      if (butt.checked){
      let x = new Date
        
         payLoad={
          "method":"a life",
          "clientId":id,
          "name":names,
          "last": x.getTime()
       }
       if (ws) ws.send(JSON.stringify(payLoad));
      
      }
        },5000)
      
    }
  }
