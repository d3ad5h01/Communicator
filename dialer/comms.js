const root_container = document.querySelector(".root-container");

let dialed_phone_number = null,communication = [];
let call_object,call_completed=0;
let res_interval;
let socket_creds={server_address:"",username:"",password:""};



/*
  WINDOW RESTRICTIONS & DEVELOPER MODE
*/
const outerWidth = window.outerWidth ;
const outerHeight = window.outerHeight;
let isResized = null;
const windowResizeHandler = () => {
  clearTimeout(isResized);
  isResized = setTimeout(() => {
    window.resizeTo(outerWidth,outerHeight);
  }, 500);
};

window.onbeforeunload = (event) => {
  if (dialed_phone_number) {
        send('call_active_cancelled',"");
        return "Sure Wanna leave?? Call is active buddy...";
  } else {
        if(call_completed==0) send("ended_before_call_started","");
        return null;
  }
};

const windowContextHandler = (event) => {
  event.preventDefault();
  return false;
};

if (!document.getElementById("switch").checked) {
  window.addEventListener("resize", windowResizeHandler);
 // window.addEventListener("beforeunload", windowUnloadHandler);
  window.addEventListener("contextmenu", windowContextHandler);
}

document.getElementById("switch").addEventListener("change", function () {
  if (this.checked) {
    window.removeEventListener("resize", windowResizeHandler);
    //window.removeEventListener("beforeunload", windowUnloadHandler);
    window.removeEventListener("contextmenu", windowContextHandler);
  } else {
    window.addEventListener("resize", windowResizeHandler);
   // window.addEventListener("beforeunload", windowUnloadHandler);
    window.addEventListener("contextmenu", windowContextHandler);
  }
});

/*
  BLINKING EFFECT OF CURSOR
*/
let cursor_text = ["|", "&nbsp;"];
let cursor_state = 0;
setInterval(() => {
  cursor_state ^= 1;
  document.getElementById("number-cursor").innerHTML =
    cursor_text[cursor_state];
}, 500);

/*
  INSERT CURSOR WITH MOUSE CLICKS
*/
function insertCursor(event) {
  let id = Number(event.target.id.slice("position-".length));
  // console.log(id);

  let span_rect = document
    .getElementById(`position-${id}`)
    .getBoundingClientRect();
  let diff = 2 * event.clientX - span_rect.left - span_rect.right > 0;
  // console.log(diff);

  dialed_digits.splice(cursor_index, 1);
  cursor_index = id + diff;
  dialed_digits.splice(cursor_index, 0, cursor_object);
  updateDialedNumber();
}

/*
  UPDATE THE DIALED_NUMBER VIEW
*/
let cursor_index = 0;
const cursor_object = {
  key: "|",
  html: '<span id="number-cursor">|</span>',
};
let dialed_digits = [cursor_object];
const dialed_number = document.querySelector(".dialed-number");

function updateDialedNumber() {
  dialed_number.innerHTML = "";
  let i = 0;
  dialed_digits.forEach((each) => {
    if (each.key != "|")
      each.html = each.html.replace(/position-\d+/, `position-${i++}`);
    dialed_number.innerHTML += each.html;
  });
  document.querySelectorAll(".editable").forEach((element) => {
    element.onclick = insertCursor;
  });
}

/*
  LISTENING TO MOUSE CLICKS
*/
document.querySelectorAll(".digit").forEach((each) => {
  each.onclick = () => {
    if (dialed_digits.length <= 10) {
      dialed_digits.splice(cursor_index++, 0, {
        key: `${each.textContent}`,
        html: `<span class="editable" id="position-0">${each.textContent}</span>`,
      });
      updateDialedNumber();
    }
  };
});

/*
  LISTENING TO CALL BUTTON
*/
const call_container = document.querySelector(".call");
const phone_button = document.getElementById("phone-button");
phone_button.disabled = true;

let dialed_phone_numbers = new Set();

phone_button.onclick = () => {
  console.log('Phone button clicked');
  if (dialed_phone_number) {
    phone_button.disabled = true;
    call_container.classList.remove("call-connected");
    call_container.classList.add("call-disconnected");
    console.log("Hung-up: ", dialed_phone_number);
    dialed_phone_number = null;
    flipDialpad(false);
    toggleTimer(false);
    call_completed =1;
    send("call_ended","");
    setTimeout(()=>{
      window.close();
    },500);
    //call_object = null;
  } else if (dialed_digits.length >0 ) {
    dialed_phone_number = "";
    dialed_digits.forEach((each) => {
      if (each.key != "|") dialed_phone_number += each.key;
    });
    if (!dialed_phone_numbers.has(dialed_phone_number))
      addToHistory(dialed_phone_number);

    dialed_phone_number = country_code.textContent + dialed_phone_number;

    call_object.to = dialed_phone_number;
    send("call_started","");


    call_container.classList.remove("call-disconnected");
    call_container.classList.add("call-connected");
    console.log("Dialing: ", dialed_phone_number);
    flipDialpad(true);
    toggleTimer(true);
  }
};

function addToHistory(dialed_phone_number) {
  let opt_tag = `<option value="${dialed_phone_number}">${dialed_phone_number}</option>`;
  document.getElementById("history").innerHTML += opt_tag;
  dialed_phone_numbers.add(dialed_phone_number);
}

const before_call = document.querySelector(".before-call");
const after_call = document.querySelector(".after-call");

function flipDialpad(flip_type) {
  document.getElementById("number-cursor").classList.toggle("hide");
  if (flip_type) {
    before_call.classList.remove("rotate0");
    before_call.classList.add("rotate-180");

    after_call.classList.remove("rotate180");
    after_call.classList.add("rotate0");
  } else {
    before_call.classList.remove("rotate-180");
    before_call.classList.add("rotate0");

    after_call.classList.remove("rotate0");
    after_call.classList.add("rotate180");
  }
}

const hour = document.getElementById("time-h");
const minute = document.getElementById("time-m");
const second = document.getElementById("time-s");
let [h, m, s, call_timer] = [0, 0, 0, null];
function toggleTimer(start) {
  if (start) {
    call_timer = setInterval(() => {
      s += 1;
      if (s >= 60) [m, s] = [m + 1, s - 60];
      if (m >= 60) [h, m] = [h + 1, m - 60];

      second.innerHTML = s < 10 ? "0" + s : s;
      minute.innerHTML = m < 10 ? "0" + m : m;
      hour.innerHTML = h < 10 ? "0" + h : h;
      call_object.duration = `${h}:${m}:${s}`;
    }, 999);
  } else {
    clearInterval(call_timer);
    [hour.innerHTML, minute.innerHTML, second.innerHTML] = ["-", "-", "-"];
    console.log(`Call duration: ${h}:${m}:${s}`);
    call_object.duration = `${h}:${m}:${s}`;
    [h, m, s, call_timer] = [0, 0, 0, null];
  }
}

/*
  LISTENING TO KEYPRESSES (DIGITS, BACKSPACE, ARROWS)
*/
const country_code = document.getElementById("country-code");

window.addEventListener("keydown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (event.key >= "0" && event.key <= "9") {
    if (dialed_digits.length <= 10) {
      dialed_digits.splice(cursor_index++, 0, {
        key: `${event.key}`,
        html: `<span class="editable" id="position-0">${event.key}</span>`,
      });
      updateDialedNumber();
    }
  } else if (event.key === "Backspace") {
    if (cursor_index > 0) {
      dialed_digits.splice(--cursor_index, 1);
      updateDialedNumber();
    }
  } else if (event.key === "ArrowLeft") {
    if (cursor_index > 0) {
      dialed_digits.splice(cursor_index--, 1);
      dialed_digits.splice(cursor_index, 0, cursor_object);
      updateDialedNumber();
    }
  } else if (event.key === "ArrowRight") {
    if (cursor_index < dialed_digits.length - 1) {
      dialed_digits.splice(cursor_index++, 1);
      dialed_digits.splice(cursor_index, 0, cursor_object);
      updateDialedNumber();
    }
  } else if (event.key === "ArrowUp") {
    if (cursor_index > 0) {
      dialed_digits.splice(cursor_index, 1);
      cursor_index = 0;
      dialed_digits.splice(cursor_index, 0, cursor_object);
      updateDialedNumber();
    }
  } else if (event.key === "ArrowDown") {
    if (cursor_index < dialed_digits.length - 1) {
      dialed_digits.splice(cursor_index, 1);
      cursor_index = dialed_digits.length;
      dialed_digits.splice(cursor_index, 0, cursor_object);
      updateDialedNumber();
    }
  } else if (event.key === "Enter") {
    phone_button.click();
  }
});

/*
  ACCESSING THE SETTINGS
*/
const main_page = document.querySelector(".main-page");
const settings_page = document.querySelector(".settings-page");

const bars_button = document.getElementById("bars-button");
const cross_button = document.getElementById("cross-button");

bars_button.onclick = () => {
  settings_page.classList.remove("invisible");
  main_page.classList.add("shift-left");
  settings_page.classList.remove("shift-right");
  setTimeout(() => {
    main_page.classList.add("invisible");
  }, 800);
};

cross_button.onclick = () => {
  main_page.classList.remove("invisible");
  settings_page.classList.add("shift-right");
  main_page.classList.remove("shift-left");
  setTimeout(() => {
    settings_page.classList.add("invisible");
  }, 800);
};

/*
  CHANGING THE THEME
*/
let cur_theme = "theme-silver";
document.getElementById("theme").addEventListener("change", (event) => {
  root_container.classList.remove(cur_theme);
  cur_theme = event.target.value;
  root_container.classList.add(cur_theme);
});

/*
  COUNTRY CODE
*/
document.getElementById("country").addEventListener("change", (event) => {
  document.getElementById("country-code").innerHTML = event.target.value;
});

/*
  DIALED NUMBER HISTORY
*/
const history_select = document.getElementById("history");
history_select.addEventListener("change", (event) => {
  addNumberToDialpad(event.target.value, false);
  cross_button.click();
  history_select.value = ""; // doesn't trigger a change
});

// addNumberToDialpad("+441116664445", true);
// addNumberToDialpad("1116664445", false);
function addNumberToDialpad(num, withCountryCode) {
  if (withCountryCode) {
    document.getElementById("country-code").innerHTML = num.slice(0, -10);
    num = num.slice(-10);
  }
  dialed_digits = [];
  Array.from(String(num)).forEach((each_digit) => {
    dialed_digits.push({
      key: `${each_digit}`,
      html: `<span class="editable" id="position-0">${each_digit}</span>`,
    });
  });
  dialed_digits.push(cursor_object);
  cursor_index = num.length;
  updateDialedNumber();
}
/*
  MUTE BUTTON
*/
const mute_button = document.getElementById("mute-button");
mute_button.onclick = () => {
  mute_button.classList.toggle("active-button");
};

/*
  HOLD BUTTON
*/
const hold_button = document.getElementById("hold-button");
hold_button.onclick = () => {
  hold_button.classList.toggle("active-button");
};



function handleSocketLiveUI(){
    console.log('Socket color');
    document.getElementById('live-socket-dot').classList.replace('socket-disconnected','socket-connected');
  
}
/////////////////////////////////
//Communication
////////////////////////////////



function send(type,object){
  if(!window.opener){
    console.log('Window closed');

  }
  else if(type == 'popup_variable'){
      return window.opener.recieve(type,window);
  }
  else if(type == 'chat'){
    window.opener.recieve(type,object);
  }
  else if(type == 'call_object'){
      return window.opener.recieve(type,call_object);
  }
  else if(type == 'ended_before_call_started' ){
      call_object.status = type;
      window.opener.recieve(type,call_object);
  }
  else if(type == 'call_active_cancelled'){
    call_object.status = type;
    window.opener.recieve(type,call_object);
  }
  else if (type == 'call_ended'){
    call_object.status = type;
    window.opener.recieve(type,call_object);

  }
  else if(type == 'call_started'){
    call_object.status = type;
    window.opener.recieve(type,call_object);
  }
  else if(type == 'get_popup_variable'){
    return window.opener.recieve('get_popup_variable','');
  }
  else if(type == 'get_call_object'){
    return window.opener.recieve('get_call_object','');
  }
  
  
}


function recieve(type,object){
  console.log(type);
  console.log(object);
  if(type == 'chat'){

  }
  else if(type == 'call_object'){
      call_object = object;
      addNumberToDialpad(call_object.to,false);
  }
  else if(type == 'reload_parent'){
    console.log('sending var to parents');
    
      // let a = false;
      // while(getTo('popup_variable')==null){
    res_interval = setInterval(()=>{
      send('popup_variable',window);
      send('call_object',call_object);
    },2500);
      // setTimeout(()=>{
       
      // },3000);
        
  }
  else if(type == 'socket_creds'){
    socket_creds = object;
    setTimeout(()=>{ connect()},4000);
   

  }
  else if(type == 'ack'){
    console.log('recived ack');
    clearInterval(res_interval);
  }
  else if(type == 'get_call_object'){
    return call_object;
  }  

}


/////

////
heartbeat();
function heartbeat(){
      setInterval(()=>{
        if(send('get_popup_variable')==null){
          send('popup_variable','');
        }
        if(send('get_call_object')==null){
            send('call_object','');
        }
      },2000);
}



//////////////JSSIP///////////////////

// document.getElementById('connect_button').addEventListener('click',()=>{
// })
var remoteView = document.getElementById("remoteView");
var call, ua;
function answer() {
  if (call) {
      call.answer({
          "extraHeaders": ["X-Foo: foo", "X-Bar: bar"],
          "mediaConstraints": { "audio": true, "video": false },
          "pcConfig": { rtcpMuxPolicy: "negotiate" },
          "rtcOfferConstraints": {
              offerToReceiveAudio: 1,
              offerToReceiveVideo: 0
          }
      });
  }
}
function decline() {
  if (call) {
      call.terminate();
  }
}
function decline() {
  if (call) {
      call.terminate();
  }
}
function connect() {
  let sip = socket_creds.username;
  let password = socket_creds.password;
  let server_address = socket_creds.server_address;
  
  var configuration = {
      sockets: [
          new JsSIP.WebSocketInterface("wss://" + server_address + ":442")
      ],
      uri: "sip:" + sip + "@" + server_address,
      authorization_user: sip,
      password: password,
      registrar_server: "sip:" + server_address,
      session_timers: false
  };
  ua = new JsSIP.UA(configuration);
  ua.on("connected", function (e) {
      handleSocketLiveUI();
      phone_button.disabled = false;
      console.log("connected", e);
  });
  ua.on("newRTCSession", function (e) {
      console.log("newRTCSession", e);
      call = e.session;
      call.on("sdp", function (e) {
          console.log("call sdp:", e);
          var lbody = e.sdp.split("\n");
          var tempbody;
          for (var i = 0; i < lbody.length; i++) {
              if (!lbody[i].indexOf("a=crypto:1")) {
                  continue;
              }
              if (!tempbody) {
                  tempbody = lbody[i];
              } else {
                  tempbody += "\n" + lbody[i];
              }
          }
          e.sdp = tempbody;
      });
      call.on("accepted", function (e) {
          console.log("call accepted", e);
      });
      call.on("progress", function (e) {
          console.log("call is in progress", e);
          answer();
      });
      call.on("confirmed", function (e) {
          console.log("call accepted/confirmed", e);
      });
      call.on("ended", function (e) {
          console.log("Call ended: ", e);
      });
      call.on("failed", function (e) {
          console.log("Call failed: ", e);
      });
      call.on("addstream", function (e) {
          console.log("call addstream: ", e);
          var remoteStream = e.stream;
          remoteView = document.getElementById("callStream");
          remoteView = JsSIP.rtcninja.attachMediaStream(remoteView, remoteStream);
      });
      call.on("peerconnection", function (e) {
          console.log("call peerconnection: ", e);
          e.peerconnection.onaddstream = function (e) {
              console.log("call peerconnection addstream:", e);
              remoteView = document.getElementById("callStream");
              var remoteStream = e.stream;
              remoteView.srcObject = remoteStream;
          };
      });
  });
  ua.start();
}