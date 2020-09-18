let registerform = document.querySelector("#register-main");
let visitoremail = document.querySelector("#visitoremailinput");
let registercontainer = document.querySelector("#register-container");
let widgetfab = document.querySelector("#widgetcontainerbox");
let widgetimage = document.querySelector("#widgetimageicon");

window.addEventListener("DOMContentLoaded", () => {
    if(getCookie("conversationToken")) window.location.href = 'chatlive.html';
    waitAndInitialize();
});

function waitAndInitialize(){
    let regxform = document.getElementById("register-container");
    let widgetLauncher = document.getElementById("widgetimageicon");
    
    setTimeout(() => {
        regxform.style.display = "block";
        widgetLauncher.src='./smsinactiveicon.png';
    },SETTINGS.waitTime);
}

registerform.onsubmit = (ev) => {
  ev.preventDefault();
  if (!visitoremail.value) return;
  
  localStorage.setItem("visitoremail",visitoremail.value);
  window.location.href = 'chatlive.html';
};

widgetfab.onclick = () => {
    let regxform = document.getElementById("register-container");
    let widgetLauncher = document.getElementById("widgetimageicon");
    
    if (regxform.style.display === "none") {
        regxform.style.display = "block";
        widgetLauncher.src='./smsinactiveicon.png';
    }
    else{
        if(regxform.style.display === "block"){
            regxform.style.display = "none";
            widgetLauncher.src='./smsactiveicon.png';
        }
        else{
            regxform.style.display = "block";
            widgetLauncher.src='./smsinactiveicon.png';
        }
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
