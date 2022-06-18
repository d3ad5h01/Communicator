let callActive =0;


window.onbeforeunload = (event) => {
    if(callActive){
      return "Call is Active. Are you sure you want to close?"
    }
    else {
      return null;
    }    
};

// toggleUnload;

// function closeWarning(){
//   event.preventDefault();
//   return "Call is Active. Are you sure you want to close?";
// }
// function toggleUnload(){
//     if(callActive)
//     {
//        window.addEventListener('beforeunload',closeWarning);
//     }
//     else{
//       window.removeEventListener('beforeunload',closeWarning);
//     }
// }

let communication =[];

let dialpadBtnContainer = document.getElementById('dialpad-btn-container');

let arr =[
    {title:"1",subtitle:"_"},
    {title:"2",subtitle:"ABC"},
    {title:"3",subtitle:"DEF"},
    {title:"4",subtitle:"GHI"},
    {title:"5",subtitle:"JKL"},
    {title:"6",subtitle:"MNO"},
    {title:"7",subtitle:"PQRS"},
    {title:"8",subtitle:"TUV"},
    {title:"9",subtitle:"WXYZ"},
    {title:"*",subtitle:"-"},
    {title:"0",subtitle:"+"},
    {title:"#",subtitle:"-"},
];


let cursorLocation=0;
console.log(arr);
let ind=-1;
arr.forEach(item => {
    ind++;
    dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn flexCol centerRow centerCol" id="dialpad${ind}">
            <p class="title-text removeDefaultPara fontColor">${item.title}</p>
            <p class="subline-text removeDefaultPara fontColor">${item.subtitle}</p>
        </div>
    </div>`;
    console.log(ind);
});

ind=-1;
setTimeout(()=>{
arr.forEach(item => {
   ind++;
    let current = document.getElementById("dialpad"+ind);
    console.log(current);
    current.onclick = function () {
        sendMessege(`typed ${item.title}`);
        console.log('clicked');
        let dialpadInput = document.getElementById('dialpad-input');
        let val = dialpadInput.value;
        console.log("BEFORE "+dialpadInput.selectionStart);
        dialpadInput.selectionStart = cursorLocation;
        dialpadInput.value = val.slice(0, cursorLocation) + item.title + val.slice(cursorLocation,val.length);
        cursorLocation++;
        handleFocus(dialpadInput.value.slice(0,cursorLocation));


    }

    console.log(ind);

});
},500);


dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn dialpad-btn-empty flexCol centerRow centerCol">
            <p class="title-text removeDefaultPara fontColor"></p>
            <p class="subline-text removeDefaultPara fontColor"></p>
        </div>
    </div>`;

dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn-caller flexCol centerRow centerCol" id="dialpad-caller-btn">
            <img class='dialpad-btn-caller-icon' src="/dialer/images/phone.png"/>
        </div>
    </div>`;

document.getElementById('dialpad-input').addEventListener('click',function(event){
    let dialpadInput = document.getElementById('dialpad-input');
   // console.log('updated cursoor location from '+cursorLocation + "to "+ dialpadInput.selectionStart );
    cursorLocation = dialpadInput.selectionStart;
})
document.getElementById('dialpad-input-btn-backspace').addEventListener('click',function (event){
    sendMessege('clicked backspace');
    event.preventDefault();
    if(cursorLocation<=0)
        return;
    console.log('backspace');
    let dialpadInput = document.getElementById('dialpad-input');
    let val = dialpadInput.value;
    dialpadInput.selectionStart = cursorLocation;
    let begin = val.slice(0,cursorLocation-1);
    let end = val.slice(cursorLocation,val.length);
    dialpadInput.value = begin + end;
    if(cursorLocation>0)
        cursorLocation--;
    handleFocus(dialpadInput.value.slice(0,cursorLocation));
});


function handleFocus(str){
    let focusWidth = getWidthOfText(str,'Courier New',"25px");
    console.log(focusWidth);
    let dialpadInput = document.getElementById('dialpad-input');
    dialpadInput.scrollLeft = focusWidth;
}

function getWidthOfText(txt, fontname, fontsize){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    var fontspec = fontsize + ' ' + fontname;
    if(getWidthOfText.ctx.font !== fontspec)
        getWidthOfText.ctx.font = fontspec;
    return getWidthOfText.ctx.measureText(txt).width;
}

document.getElementById("dialpad-caller-btn").addEventListener('click',handleCallButtonTheme);

function handleCallButtonTheme(){
    console.log('clicked');
    let btn = document.getElementById("dialpad-caller-btn");
    console.log(btn.style.backgroundColor);
    callActive = (callActive+1)%2;
    console.log(callActive);
    if(callActive){
        sendMessege(`calling`)
        btn.style.backgroundColor='#BA0001';
       // toggleUnload();
    }
    else{
      sendMessege(`ended`)
         btn.style.backgroundColor='#49B568';
         //toggleUnload();
    }

}




///////////////////communication login



function sendMessege(messege){
  console.log('Dialer:'+messege);
  window.opener.recieveMessege(messege);
  communication.push("Parent#"+messege);
  document.getElementById('messeges').innerHTML+=`Dialer: ${messege} </br>`;
}

function recieveMessege(messege){
  console.log('Dialer:'+ messege);
 
  communication.push("Dialer#"+messege);
  document.getElementById('messeges').innerHTML+=`Parent: ${messege} </br>`;
  
}


document.getElementById('send-messege').addEventListener('click',()=>{
  sendMessege(document.getElementById('messege-area').value);
  document.getElementById('messege-area').value='';
})