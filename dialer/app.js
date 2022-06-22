// let callActive = 0,communication = [];
// //dialpadBtnContainer = document.getElementById("dialpad-btn-container");
// let popup_win, parent,call_object,call_completed=0;
// let res_interval;

// send("dialer_started","");
// setInterval(()=>{
//   console.log(call_object);
// },2000);

// // This is to handle close window logic
// // If call is active then only show warning.
// window.onbeforeunload = (event) => {
//   if (callActive) {
//     send('call_active_cancelled',"");
//     return "Sure Wanna leave?? Call is active buddy...";
//   } else {
//     if(call_completed==0) send("ended_before_call_started","");
//     return null;
//   }
// };


// // // dial button 
// // document
// //   .getElementById("dialpad-caller-btn")
// //   .addEventListener("click", handleCallButtonTheme);

// // Green Dial button in dialpad logic handle
// // This also simulates calling logic
// // the callActive logic is handled by this   
// function handleCallButtonTheme() {
//   let btn = document.getElementById("dialpad-caller-btn");
//   callActive = (callActive + 1) % 2;
//   if (callActive) {
//     call_object.to = document.getElementById("dialpad-input").value;
//     send("call_started","");
//     btn.style.backgroundColor = "#BA0001";
//   } else {
//     call_completed=1;
//     send("call_ended","");
//     btn.style.backgroundColor = "#49B568";
//   }
// }

// // document.getElementById("send-message").addEventListener("click", () => {
// //   send("chat",document.getElementById("message-area").value);
// //   document.getElementById("message-area").value = "";
// // });





// function send(type,object){
//   if(type == 'popup_variable'){
//       return window.opener.recieve(type,window);
//   }
//   else if(type == 'chat'){
//     window.opener.recieve(type,object);
//   }
//   else if(type == 'call_object'){
//       return window.opener.recieve(type,call_object);
//   }
//   else if(type == 'ended_before_call_started' ){
//       call_object.status = type;
//       window.opener.recieve(type,call_object);
//   }
//   else if(type == 'call_active_cancelled'){
//     call_object.status = type;
//     window.opener.recieve(type,call_object);
//   }
//   else if (type == 'call_ended'){
//     call_object.status = type;
//     window.opener.recieve(type,call_object);

//   }
//   else if(type == 'call_started'){
//     call_object.status = type;
//     window.opener.recieve(type,call_object);
//   }
// }

// // function getTo(type){
// //   if(type == 'popup_variable'){
// //     window.opener.getFrom(type);
// //   }
// // }



// function recieve(type,object){
//   console.log(type);
//   console.log(object);
//   if(type=='popup_variable'){
//       popup_win = object;
//   }
//   else if(type == 'chat'){

//   }
//   else if(type == 'call_object'){
//       call_object = object;
//   }
//   else if(type == 'reload_parent'){
//     console.log('sending var to parents');
    
//       // let a = false;
//       // while(getTo('popup_variable')==null){
//     res_interval = setInterval(()=>{
//       send('popup_variable',window);
//       send('call_object',call_object);
//     },2500);
//       // setTimeout(()=>{
       
//       // },3000);
        
//   }
//   else if(type == 'ack'){
//     console.log('recived ack');
//     clearInterval(res_interval);
//   }  
//   }




// // class Message {
// //   constructor(header, comment, object) {
// //     this.header = header;
// //     this.comment = comment;
// //     this.object = object;
// //   }
// // }

// // const sendPreviousParent = () => {
// //   setTimeout(() => {
// //     sendMessage(new Message("reloaded", "previous dialer details", window));
// //   }, 2000);
// // };

// // function sendMessage(message) {
// //   if (window.opener) {
// //     window.opener.receiveMessage(message);
// //   } else {
// //     console.log("no parent window available");
// //   }
// // }

// // function receiveMessage(message) {
// //   if (message.header === "acknowledged") console.log(message.comment);
// //   else if (message.header === "unloading") sendPreviousParent();

// //   if (message.header && message.header != "acknowledged")
// //     sendMessage(new Message("acknowledged", "sent successfully", null));
// // }

// // sendMessage(new Message("initiated", "dialer popped up", null));
