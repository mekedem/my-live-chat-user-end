import Visitor from './visitorClass';
import EmojiButton from './emojiBtn';
import { CHAT_ASSET_SERVER_URL } from './constants';
import { isEmail } from './validator';

function addCssLink(link) {
  const cssLink = document.createElement('link');
  cssLink.type = 'text/css';
  cssLink.rel = 'stylesheet';
  cssLink.href = link;
  document.head.appendChild(cssLink);
}

(function () {
  const robotoFont = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
  const fontAwesome = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css";
  const customCss = `${CHAT_ASSET_SERVER_URL}/css/app.css`;
  addCssLink(robotoFont);
  addCssLink(fontAwesome);
  addCssLink(customCss);
})();



// the chatwidget will be mounted in this div.
const mountPoint = document.createElement('div');
mountPoint.id = 'livechat-mountpoint-xxyyzz';
document.body.appendChild(mountPoint);

const indexHTML = `
<div id="register-container" class="register-container">
    <div id="welcomeregistry">
         Welcome to our Live Chat Please fill in the form below before starting 
    </div>
    <form id="register-main" class="register-main">
        <input id="visitoremailinput" type="email" placeholder="Email Address *" required/>        
        <div id="registerterms">
            <input type="checkbox" checked="checked" required> 
            <span>I agree to terms and conditions of these me agree to terms and 
            conditions of these me agree to terms and conditions of these me
            agree to terms and conditions of these me</span> 
        </div>
        <button type="submit"> START </button>
    </form>
</div>
<div id="widgetcontainerbox">
    <div id="customwidget">
      <img id="widgetimageicon" src="${CHAT_ASSET_SERVER_URL}/images/smsactiveicon.png"/>
    </div>
</div>
`;

const chatLiveHTML = `
<div id="chat-container" class="chat-container">
    <div class="chat-main">
      <div class="chat-header">
        <img id="avatar_img" src="${CHAT_ASSET_SERVER_URL}/images/avatar.png" alt="Avatar" class="avatar">
        <div id="agentName" class="group-name">
          <span id="agent_Name">Hi there</span>
          <span id="onoffindicatoroff">o</span>
        </div>
        <div>
          <div class="widgetdropdown" style="float:right;">
            <img id="widgetdropbtn" class="widgetdropbtn" src="${CHAT_ASSET_SERVER_URL}/images/more_vert_white.png"/>
            <div id="widgetdropdown-content" class="widgetdropdown-content">
              <div id="notification" class="widgetdropdown-item">
                <span id="enabledisable">Notification on</span>
              </div>
              <div id="rating" class="widgetdropdown-item">
                <span id="rating-text">Rate converstation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="chatMessages" class="chat-messages">
      </div>
      <div class="chat-footer">
        <form id="messageSendForm">
          <span id="triggerpickerbtn">&#128578;</span>
          <input id="messageInput" type="text" placeholder="Type message here...">
        </form>
      </div>
    </div>
  </div>
  <div id="widgetcontainerbox">
    <div id="customwidget">
      <img id="widgetimageicon" src="${CHAT_ASSET_SERVER_URL}/images/smsinactiveicon.png"/>
      <span id="notificationbadge"> 2 </span> 
    </div>
  </div>
`;

function mountIndex() {
  // mounting in directly as the document body. this will have to change.
  mountPoint.innerHTML = indexHTML;
  // ----------------------------------- mekedeme's code starts here --------------------------------
  let registerform = document.querySelector("#register-main");
  let visitoremail = document.querySelector("#visitoremailinput");
  let registercontainer = document.querySelector("#register-container");
  let widgetfab = document.querySelector("#widgetcontainerbox");
  let widgetimage = document.querySelector("#widgetimageicon");

  window.addEventListener("DOMContentLoaded", () => {
    new Visitor();
    if (getCookie("conversationToken")) mountChatLive();
    waitAndInitialize();
  });

  function waitAndInitialize(){
    let regxform = document.getElementById("register-container");
    let widgetLauncher = document.getElementById("widgetimageicon");
    
    setTimeout(() => {
        regxform.style.display = "block";
        widgetLauncher.src=`${CHAT_ASSET_SERVER_URL}/images/smsinactiveicon.png`;
    },SETTINGS.waitTime);
  }

  registerform.onsubmit = (ev) => {
    ev.preventDefault();
    if (!isEmail(visitoremail.value)) {
      return;
    }
    localStorage.setItem("visitoremail", visitoremail.value);
    mountChatLive();
  };

  widgetfab.onclick = () => {
    let x = document.getElementById("register-container");
    let y = document.getElementById("widgetimageicon");

    if (x.style.display === "none") {
      x.style.display = "block";
      y.src = `${CHAT_ASSET_SERVER_URL}/images/smsinactiveicon.png`;
    }
    else {
      if (x.style.display === "block") {
        x.style.display = "none";
        y.src = `${CHAT_ASSET_SERVER_URL}/images/smsactiveicon.png`;
      }
      else {
        x.style.display = "block";
        y.src = `${CHAT_ASSET_SERVER_URL}/images/smsinactiveicon.png`;
      }
    }
  }
}

function mountChatLive() {
  // mounting in directly as the document body. this will have to change.
  mountPoint.innerHTML = chatLiveHTML;

  let notified = JSON.parse(localStorage.getItem("NotificationEnabled"));
  let enabledisabletext = document.querySelector("#enabledisable");
  if (notified) { enabledisabletext.textContent = "Notification off" }
  else { enabledisabletext.textContent = "Notification on" }

  let messageInput = document.querySelector("#messageInput");
  let triggerbutton = document.querySelector("#triggerpickerbtn");
  const picker = new EmojiButton({ position: 'auto', });
  picker.on('emoji', function (emoji) { messageInput.value += emoji; });
  triggerbutton.addEventListener('click', function () { picker.pickerVisible ? picker.hidePicker() : picker.showPicker(messageInput); });

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

mountIndex();