let registerform = document.querySelector("#register-main");
let visitoremail = document.querySelector("#visitoremailinput");
let registercontainer = document.querySelector("#register-container");
let widgetfab = document.querySelector("#widgetcontainerbox");
let widgetimage = document.querySelector("#widgetimageicon");

window.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("conversationToken")){
        window.location.href = 'chatlive.html';
    }
});

registerform.onsubmit = (ev) => {
  ev.preventDefault();
  if (!visitoremail.value){
    return;
  }
localStorage.setItem("visitoremail",visitoremail.value);
window.location.href = 'chatlive.html';
};

widgetfab.onclick = () => {
    let x = document.getElementById("register-container");
    let y = document.getElementById("widgetimageicon");
    
    if (x.style.display === "none") {
        x.style.display = "block";
        y.src='./smsinactiveicon.png';
    }
    else{
        if(x.style.display === "block"){
            x.style.display = "none";
            y.src='./smsactiveicon.png';
        }
        else{
            x.style.display = "block";
            y.src='./smsinactiveicon.png';
        }
    }
}
