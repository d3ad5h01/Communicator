let callActive = 0;
let communication = [];
let dialpadBtnContainer = document.getElementById("dialpad-btn-container");
let popup_win;
let parent;
let call_object;
let call_completed=0;
popup_win = window.opener.getPopUpVariable();
sendMessage({header:"dialer_started",message:""});

// document.addEventListener("contextmenu", (event) => event.preventDefault());

// TO prevent resize of popup window.
window.addEventListener(
  "resize",
  function (event) {
    window.resizeTo(426, 700);
  },
  true
);

// This is to handle close window logic
// If call is active then only show warning.
window.onbeforeunload = (event) => {
  if (callActive) {
    sendMessage({header:'call_active_cancelled',});
    return "Sure Wanna leave?? Call is active buddy...";
  } else {
    if(call_completed==0) sendMessage({header:"ended_before_call_started",message:""});
    return null;
  }
};



let arr = [
  { title: "1", subtitle: "_" },
  { title: "2", subtitle: "ABC" },
  { title: "3", subtitle: "DEF" },
  { title: "4", subtitle: "GHI" },
  { title: "5", subtitle: "JKL" },
  { title: "6", subtitle: "MNO" },
  { title: "7", subtitle: "PQRS" },
  { title: "8", subtitle: "TUV" },
  { title: "9", subtitle: "WXYZ" },
  { title: "*", subtitle: "-" },
  { title: "0", subtitle: "+" },
  { title: "#", subtitle: "-" },
];

// DIALPAD LOGIC
let cursorLocation = 0;
let ind = -1;

// ADDED BUTTON TO DIAL PAD
arr.forEach((item) => {
  ind++;
  dialpadBtnContainer.innerHTML += `<div class="dialbtn-wrapper">
        <div class="dialpad-btn flexCol centerRow centerCol" id="dialpad${ind}">
            <p class="title-text removeDefaultPara fontColor">${item.title}</p>
            <p class="subline-text removeDefaultPara fontColor">${item.subtitle}</p>
        </div>
    </div>`;
});

ind = -1;

// ADDED EVENT LISTENERS TO DIALPAD
setTimeout(() => {
  arr.forEach((item) => {
    ind++;
    let current = document.getElementById("dialpad" + ind);
    current.onclick = function () {
      //sendMessage(`typed ${item.title}`);
      let dialpadInput = document.getElementById("dialpad-input");
      let val = dialpadInput.value;
      dialpadInput.selectionStart = cursorLocation;
      dialpadInput.value =
        val.slice(0, cursorLocation) +
        item.title +
        val.slice(cursorLocation, val.length);
      cursorLocation++;
      handleFocus(dialpadInput.value.slice(0, cursorLocation));
    };
  });
}, 500);

// ADDING CALL BUTTON TO DIALPAD
dialpadBtnContainer.innerHTML += `<div class="dialbtn-wrapper">
        <div class="dialpad-btn dialpad-btn-empty flexCol centerRow centerCol">
            <p class="title-text removeDefaultPara fontColor"></p>
            <p class="subline-text removeDefaultPara fontColor"></p>
        </div>
    </div>`;

dialpadBtnContainer.innerHTML += `<div class="dialbtn-wrapper">
        <div class="dialpad-btn-caller flexCol centerRow centerCol" id="dialpad-caller-btn">
            <img class='dialpad-btn-caller-icon' src="./images/phone.png"/>
        </div>
    </div>`;

// DIALPAD INPUT FOCUS HANDLING
document
  .getElementById("dialpad-input")
  .addEventListener("click", function (event) {
    let dialpadInput = document.getElementById("dialpad-input");
    cursorLocation = dialpadInput.selectionStart;
  });

// DIALPAD
document
  .getElementById("dialpad-input-btn-backspace")
  .addEventListener("click", function (event) {
    //sendMessage("clicked backspace");
    event.preventDefault();
    if (cursorLocation <= 0) return;
    let dialpadInput = document.getElementById("dialpad-input");
    let val = dialpadInput.value;
    dialpadInput.selectionStart = cursorLocation;
    let begin = val.slice(0, cursorLocation - 1);
    let end = val.slice(cursorLocation, val.length);
    dialpadInput.value = begin + end;
    if (cursorLocation > 0) cursorLocation--;
    handleFocus(dialpadInput.value.slice(0, cursorLocation));
  });

// This handle the focus location 
// To get in width to input in scroll left, we use getWidth property.
function handleFocus(str) {
  let focusWidth = getWidthOfText(str, "Courier New", "25px");
  console.log(focusWidth);
  let dialpadInput = document.getElementById("dialpad-input");
  dialpadInput.scrollLeft = focusWidth;
}

// This gets the width in px from start , from prop such as font type , font size and text string
function getWidthOfText(txt, fontname, fontsize) {
  if (getWidthOfText.c === undefined) {
    getWidthOfText.c = document.createElement("canvas");
    getWidthOfText.ctx = getWidthOfText.c.getContext("2d");
  }
  var fontspec = fontsize + " " + fontname;
  if (getWidthOfText.ctx.font !== fontspec) getWidthOfText.ctx.font = fontspec;
  return getWidthOfText.ctx.measureText(txt).width;
}



// dial button 
document
  .getElementById("dialpad-caller-btn")
  .addEventListener("click", handleCallButtonTheme);

// Green Dial button in dialpad logic handle
// This also simulates calling logic
// the callActive logic is handled by this   
function handleCallButtonTheme() {
  let btn = document.getElementById("dialpad-caller-btn");
  callActive = (callActive + 1) % 2;
  if (callActive) {
    sendMessage({header:"call_started",message:`${document.getElementById("dialpad-input").value}`});
    btn.style.backgroundColor = "#BA0001";
  } else {
    call_completed=1;
    sendMessage({header:"call_ended",message:""});
    btn.style.backgroundColor = "#49B568";
  }
}
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// Communication logic 
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////




 /*
            Send Message

            window.opener is address of parent window
            We can access its function so,

            we access its recieveMessage function and use it to share message.

*/
function sendMessage(ack) {

  // sending to remote
  //let ack = {header: ack.header, message: ack.message, object: ack.object};
  window.opener.recieveMessage(ack);


  // Local updation
  console.log("Dialer:" + ack.message);
  communication.push("Dialer#"+ack.header+"#"+ack.message);
  document.getElementById("messages").innerHTML += `Dialer: ${ack.message} </br>`;
}

function recieveMessage(ack) {

  if(ack.header == 'reload_parent'){
    console.log('sending var to parents');
    setTimeout(()=>{
      // sendParentVariable();
      sendPopUpVariable();
      sendMessage({header:'call_object',object:call_object})
    },2000);
  }
  else if(ack.header=='call_object'){
      call_object = ack.object;
  }
// Local updation
  console.log("Dialer:" + ack.header);
  // communication.push("Dialer#" + message);
  document.getElementById("messages").innerHTML += `Parent: ${ack.message} </br>`;
}

// Button to send message 
document.getElementById("send-message").addEventListener("click", () => {
  sendMessage({header:"communicate",message:document.getElementById("message-area").value});
  document.getElementById("message-area").value = "";
});


function updateCallObject(ack){
  sendMessage({header:"communicate",message:'updating prop'});
  for (const property in ack) {
   // console.log(`${property}: ${object[property]}`);
    call_object[property] = ack[property] ;
  }
  sendMessage({header:"communicate",message:'updating prop end'});

}



/// COMMUNICATION GET SET
function setParentVariable(parentVar){
  parent = parentVar;
}

function getParentVariable(){
  return parent;
}

function sendParentVariable(){
  console.log("sending parent to parent");
  window.opener.setParentVariable(parent);
}

function setPopUpVariable(childVar){
  popup_win = childVar;
}

function getPopUpVariable(){
  return window;
}

function sendPopUpVariable(){
  console.log('sending popup to parent')
  window.opener.setPopUpVariable(window);
}