
     const select = document.querySelector('#groups'); 
     const messages = document.querySelector('#livearea'); 
     var id;
     let ws;
     var liveon=true; 
     let button =document.querySelector("#onOff");
     let alln=document.querySelector("#number");
     button.innerHTML=localStorage.getItem("liveDiscon")|| "connect";
     if (button.innerHTML === "disconnect"){
         connect();
     }
     select.oninput = function grp(){
       let stdhtml=messages.childNodes;
       alln.innerHTML="All ("+messages.childNodes.length+")";
       if(/All/i.test(select.value))
       {
         for (let index = 0; index < stdhtml.length; index++) {
             const element = stdhtml[index];
             element.style.display="";
          }
       }
       else  {
            for (let index = 0; index < stdhtml.length; index++) {
             const element = stdhtml[index];
             let z=element.innerHTML.split("\n")[1][0];
             if (select.value[6]!=z.trim())  element.style.display="none";
             else element.style.display="";
           }
       }
       
     }
     button.onclick=function onoff (){
       if (button.innerHTML=="disconnect"){
         liveon=false;
        // messages.style.display="none";
         ws.send(JSON.stringify({"method":"stop"}));
         button.innerHTML="connect";
    
         localStorage.setItem("liveDiscon","disconnect")
         
         return;
       }
       else if (button.innerHTML=="connect")
       {  
          liveon=true;
          connect();
          
         // messages.style.display="";
          
          button.innerHTML="disconnect";
          
          localStorage.setItem("liveDiscon","disconnect")
          requestAll(ws);
          return;
       }
     }  
     function requestAll(ws){
      if(!ws)

     ws.send(JSON.stringify({
        "method":"requestAll",
      }))  
    }
   function connect() {
     
    
  
    onconection={std:[],last:[],ids:[],group:[],numingrp:[]};
    list =[];
    ws = new WebSocket('ws://localhost:8000');
    ws.onopen = () => {
      setTimeout(()=> {ws.send(JSON.stringify({
        "method":"admin",
        "clientId":id
      }
      ))
      ws.send(JSON.stringify({"method":"come"}));
    },500);  

      console.log('Connection opened!');
    }
    ws.onmessage = ({ data }) => {
      showMessage(data)
      console.log(data)
      //requestAll(ws);
    }    
    ws.onclose = function() {
      ws = null;
    }
      
     function showMessage(message) { 
      if (isJsonParsable(message)){ 
        
        let obj = JSON.parse(message);
        let name;
        if (obj.name) name=obj.name.split('\n').shift();
        
        if (obj.method=="@has disconected@"){
          let index=onconection.std.indexOf(name);
            if (index!=-1){
                messages.childNodes[index].remove();
                onconection.std.splice(index,1);
                onconection.last.splice(index,1);
                onconection.ids.splice(index,1);
                list.splice(index,1);
                let i = onconection.group.indexOf(obj.name.split('\n').pop());
               
                onconection.numingrp[i]-=1;
                let grp=obj.name.split('\n').pop();
              
                select.childNodes[i+3].innerHTML="group "+grp+"("+onconection.numingrp[i]+")";
                
                if(onconection.numingrp[i]===0)
                {
                  let array=select.childNodes;
                 
                        for (let index = 0; index < array.length; index++) {
                       const element = array[index];
                       
                    try{
                      
                       if (element.innerHTML[6]==grp){ 
                         select.removeChild(element);
                       }
                      }
                      catch(e){
                       
                        continue;
                      }
                        }
                  
                //  select.childNodes[index+1].remove();
                 
                alln.innerHTML="All ("+messages.childNodes.length+")";
                  
                  onconection.group.splice(index,1);
                }
            }
          return;
        }
        if (obj.method=="code" && liveon){
          
          let code=obj.code
           //alert('code') ;
          // the live show just for the student in the lists
            let d = new Date();
            let index = onconection.std.indexOf(name)
            //mis a jour le contenue de l'element
            //alert(onconection.ids+"///"+onconection.std); 
           // alert("rrrrr "+index)
            if (index !=-1 ){
                 // alert(obj.clientId+"''''''"+onconection.ids)
                //  if (obj.clientId==onconection.ids[index]){
                  
                 list[index].setValue(code);
                  onconection.last[index]=d ;
                 
               
                 /* }      
                  else{

                    ws.send(JSON.stringify({"method":"already in","clientId":obj.clientId}))
                    alert("another one is trying to accsess your account")
                  }*/
            }
            else {
              //creat a new element list
              let x=document.createElement("div");
              let head =document.createElement("h2");
              head.innerHTML=obj.name;
              x.appendChild(head);
              list.push(CodeMirror(x, {
                value: code ,
                mode: 'asm86',
                theme: 'monokai',
                smartIndent: false,
                lineNumbers: true,
                indentWithTabs: true,
      
                readOnly: true
              }));
          
              messages.appendChild(x);
              
             // x.innerHTML="<h3>"+obj.name+" "+"</h3>"+"<br>"+code+"<br>"+d;
              onconection.std.push(name);
              onconection.last.push(d);
              let grp=obj.name.split('\n').pop();
              let index=onconection.group.indexOf(grp)
              
              if (index==-1){
                  onconection.group.push(grp);
                  onconection.numingrp.push(1);
                  let w=document.createElement("option");
                  w.innerHTML= "group "+grp+"("+1+")";
                  select.appendChild(w);
              }
              else{
                  onconection.numingrp[index]++; 
                  
                select.childNodes[index+3].innerHTML="group "+grp+"("+onconection.numingrp[index]+")";
                 // alert("("+onconection.numingrp[index]+")",index)
              
              }
         
              alln.innerHTML="All ("+messages.childNodes.length+")";
             
            }
         

        }
        if (obj.method=="hello" && liveon){
           id=obj.clientId;
        }

       }
     }
     return ws;
  };

  // function verify if a string is a correct json form or not
     const isJsonParsable = string => {
                try {
                JSON. parse(string);
                } catch (e) {
                return false;
                }
                return true;
                }
                



                // dayi =thagi = da = here
                //dina = there
                //tayi= this  
                // thina= this th femina
                // wayi / wina  = hada/ hadak
                // anitha = where
                // ikel = all
                // aywa9= when
                // aniwa = wich
                // wina 
            
       