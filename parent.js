
let popup_win,communication = [],isPopupActive =0,call_object;

let localSessionStorage =0;
//session restore 

if(localSessionStorage){
    if(sessionStorage.getItem('is_popup_active')!=null){
        isPopupActive = sessionStorage.getItem('is_popup_active');
    }
    else{
        sessionStorage.setItem('is_popup_active',0);
    }
}


// setInterval(()=>{
//     console.log(call_object);
//     console.log(popup_win);
// },2000)

window.onbeforeunload = (event) => {
   send('reload_parent',"");
   return "";
};

const dialButton = document.getElementById("dial-button");

//On click of dial button , opening popup and adding dialed number in its dial-input
dialButton.onclick = () => {
   
    if(isPopupActive!=0)
        return;
    
    isPopupActive=1;
    if(localSessionStorage) sessionStorage.setItem('is_popup_active',1);
    popup_win = open('./dialer/popup.html', 'popup',"left=100, top=100, width=426px, height=653px");
    call_object = createCallObject({to: document.getElementById('number-area').value});
    handleDialStart(call_object);

    setTimeout(() => {
        send('call_object',call_object);
        //popup_win.document.getElementById('dialpad-input').value = document.getElementById('number-area').value;
    }, 1000);
    
   

};


function addmessageLocally(message){
    console.log(message);
    communication.push(message);
    document.getElementById('messages').innerHTML += ` <div class='maxWidth border1B padding10' '>${message}</div>`;
}


function handleClose(){
    if(popup_win)
        popup_win.close();
    isPopupActive = 0;
    if(localSessionStorage) sessionStorage.setItem('is_popup_active',0);
    if(localSessionStorage) sessionStorage.removeItem('call_object');
    call_object = null;
    popup_win = null;            
}




//Send message button handeling
// document.getElementById('send-message').addEventListener('click', () => {
//     send('chat',document.getElementById('message-area').value);
//     document.getElementById('message-area').value = '';
// })

// Irrelevent style handeling logic
// const txt = document.querySelector('#message-area');
// function setNewSize() {
//     this.style.height = "1px";
//     this.style.height = this.scrollHeight + "px";
// }
// txt.addEventListener('keyup', setNewSize);



// call object
// id, duration, to , started 




function updateCallObject(){
    let ack = call_object;
    if(document.getElementById(`${call_object.id}`)==null){
        addInCallBox(call_object);
    }else
        document.getElementById(`${call_object.id}`).innerHTML = `TO: ${ack.to} </br> STATUS: ${ack.status} </br> DURATION: ${ack.duration} </br> Started:${ack.started} ID: ${ack.id} </br> `;
}   

function addInCallBox(ack){
    console.log("I am ");
    console.log((createCallObject(ack,2)));
    document.getElementById('content-body-box').innerHTML += (`<div class='border1B padding10' id='${ack.id}'> TO: ${ack.to} </br> STATUS: ${ack.status} </br> DURATION: ${ack.duration} </br> Started:${ack.started} ID: ${ack.id} </br> </div>`);
}

function handleDialStart(ack){
    addInCallBox(ack);
}

function createCallObject(ack){
    return {id: callIdCreate(), duration: "NA" , to:ack.to, started: new Date(), status:'DIALER_STARTED'};
}

function callIdCreate(){
    return Number(new Date());
}




//// communication /////
function send(type,object){
    addmessageLocally("Parent#"+type);
    if(!isPopupActive)
        return;
    if(type=='popup_variable'){
        popup_win.recieve(type,popup_win);
    }
    else if(type == 'chat'){
        addmessageLocally("Parent#"+object);
    }
    else if(type == 'call_object'){
        popup_win.recieve(type,call_object);
    }
    else if(type == 'reload_parent'){
        popup_win.recieve(type,"");
    }
    else if(type == 'ack'){
        console.log('sending ack');
        popup_win.recieve('ack','');
    }
    

}


function recieve(type,object){
    addmessageLocally('Popup#'+type);
    console.log(object);
    if(type=='popup_variable'){
        if(isPopupActive)popup_win = object;
        send('ack','');
        //return popup_win!=null;
    }
    else if(type == 'chat'){

    }
    else if(type == 'call_object'){
        call_object = object;
        updateCallObject();
        if(!isPopupActive) call_object = null;
        return call_object!=null;
    }
    else if(type == 'ended_before_call_started' ){
        call_object = object;
        updateCallObject();
        handleClose();
    }
    else if(type == 'call_active_cancelled'){
        call_object = object;
        updateCallObject();
        handleClose();
    }
    else if (type == 'call_ended'){
        call_object = object;
        updateCallObject();
        handleClose();
    }
    else if(type == 'call_started'){
        call_object = object;
        updateCallObject();
    }
    else if(type == 'get_popup_variable'){
        return popup_win;
    }
    else if(type == 'get_call_object'){
        return call_object;
    }
}



