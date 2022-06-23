
let popup_win,communication = [],isPopupActive =0,call_object;
let socket_creds={server_address:"https://cpaas.ozonetel.com/",username:"10075",password:"10075"};
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

// document.getElementById('session-storage-button').addEventListener('click',()=>{
//     localSessionStorage =localSessionStorage^1;
// })

document.getElementById('update-sip-creds-button').addEventListener('click',()=>{
    socket_creds.server_address = document.getElementById('server_address').value;
    socket_creds.username = document.getElementById('username').value;
    socket_creds.password = document.getElementById('password').value;
    send('socket_creds',"");

})

window.onbeforeunload = (event) => {
   send('reload_parent',"");
   return '';
};

const dialButton = document.getElementById("dial-button");

//On click of dial button , opening popup and adding dialed number in its dial-input
dialButton.onclick = () => {
   
    if(socket_creds.server_address==''){
        alert('Add socket Address pls!!');
    
    }
    else if(isPopupActive!=0)
        return;
    else{
        isPopupActive=1;
        if(localSessionStorage) sessionStorage.setItem('is_popup_active',1);
        popup_win = open('./dialer/popup.html', 'popup',"left=100, top=100, width=426px, height=653px");
        call_object = createCallObject({to: document.getElementById('number-area').value});
        handleDialStart(call_object);

        setTimeout(() => {
            send('call_object',call_object);
            send('socket_creds',"");
        }, 1000);
    }
   

};


function addmessageLocally(message){
    console.log(message);
    communication.push(message);
    document.getElementById('messages').innerHTML += ` <div class='maxWidth border1B padding10 overflowScroll' '>${(new Date()).getHours()}:${(new Date()).getMinutes()}:${ (new Date()).getSeconds()}#${message}</div>`;
}


function handleClose(){
    if(popup_win)
        popup_win.close();
    document.getElementById(`${call_object.id}`).classList.remove('activeCallBox');
    isPopupActive = 0;
    if(localSessionStorage) sessionStorage.setItem('is_popup_active',0);
    if(localSessionStorage) sessionStorage.removeItem('call_object');
    call_object = null;
    popup_win = null;            
}




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
    document.getElementById('content-body-box').innerHTML = (`<div class='border1B padding10' id='${ack.id}'> TO: ${ack.to} </br> STATUS: ${ack.status} </br> DURATION: ${ack.duration} </br> Started:${ack.started} ID: ${ack.id} </br> </div>`)+document.getElementById('content-body-box').innerHTML ;
    document.getElementById(`${call_object.id}`).classList.add('activeCallBox');

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
    else if(type == 'socket_creds'){
        popup_win.recieve('socket_creds',socket_creds);
    }
    

}


function recieve(type,object){
    if(!(type == 'get_popup_variable' || type == 'get_call_object')) 
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



