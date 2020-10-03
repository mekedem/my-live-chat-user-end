import io from './socket.io';
import E from './events';
import { API_SERVER_URL, CHAT_SERVER_URL, CHAT_ASSET_SERVER_URL } from './constants';
import { isEmail, isFullName, isNonEmptyString } from './validator';
// import { PROJECT_ID, SETTINGS } from './constants';

class Visitor {
    constructor() {
        this.room = null;
        this.insureBrowserID();
        setTimeout(() => {
            this.setupSocket();
        }, 600);
        this.notificationcount = 0;
        this.projectID = PROJECT_ID;
    }

    enforceProjectSettings() {
        document.documentElement.style.setProperty('--main-color', APPEARANCE.themeColor);
        document.documentElement.style.setProperty('--main-color-dark', APPEARANCE.themeColor);
        if (SETTINGS.hideWidgetOnMobile) { if(this.mobilecheck()) {
            //kene akatew aytay or demo minimized yihun
        } }
        if (SETTINGS.fileUploadAllowed) { 
            //don't show file attach button
        }
        if (!SETTINGS.chatRatingAllowed) { document.getElementById('rating').style.display = 'none' }
        if (!SETTINGS.emojiInChatAllowed) { document.getElementById('triggerpickerbtn').style.display = 'none'; }
    }

    insureBrowserID() {
        if (!localStorage.getItem("browserID")) {
            // change this to a more unique id (ex: use UUID)
            const id = Math.random();
            localStorage.setItem("browserID", `${id}`);
        } else {
            console.log('got a browserID');
        }
    }

    mobilecheck() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    setupSocket() {
        const browserID = localStorage.getItem('browserID');

        const visitorQuery = {
            usertype: 'visitor',
            browserID: browserID,
            projectID: this.projectID,
        };

        this.socket = io(CHAT_SERVER_URL, { query: visitorQuery, forceNew: true });

        this.socket.on(E.AGENTASSIGNED, this.onAgentssigned.bind(this));
        this.socket.on(E.MESSAGE, this.onMessage.bind(this));
        this.socket.on(E.OFFLINE, this.onOffline.bind(this));
        this.socket.on(E.ONLINE, this.onOnline.bind(this));
        this.socket.on(E.ACTIVECHATCLOSED, this.onChatClosed.bind(this));
        this.socket.on(E.STARTEDCONVERSATION, this.onConversationStarted.bind(this));

        // reserved event names.
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('error', this.onError.bind(this));
    }

    setupDomListeners() {
        //dom variables
        let sendMessageForm = document.querySelector("#messageSendForm");
        let customwidget = document.querySelector("#customwidget");  //launcher button to show & hide chat

        let notification = document.querySelector("#notification"); // notification item on dropdown
        let ratingConv = document.querySelector("#rating"); // rating item on dropdown

        sendMessageForm.onsubmit = (ev) => {
            ev.preventDefault();
            this.onSend();
        }

        customwidget.onclick = () => this.onToggleWidget();
        notification.onclick = () => this.onNotification();
        ratingConv.onclick = () => this.onConversationRating();

        document.querySelector("#chatMessages").addEventListener('click', (e) => {
            if (e.target.className == 'goodrating' || e.target.className == 'likebutton') { this.onAfterRating(true); }
            else if (e.target.className == 'badrating' || e.target.className == 'dislikebutton') { this.onAfterRating(false); }
            else if (e.target.className == 'offline-button') { this.onSubmitOfflineMessage(); }
            else { return }
        });

        document.querySelector('#messageInput').addEventListener('input', (e) => {
            if (SETTINGS.showVisitorTyping) this.visitorTyping(e.target.value, false);
            if (SETTINGS.sneakPreview) {
                setTimeout(() => {
                    this.visitorTyping(e.target.value, true);
                }, 1000);
            }
            else { return }
        });

        this.enforceProjectSettings();
    }

    appendMessage(text, incomming) {
        let chatMessagesCtr = document.querySelector("#chatMessages");
        const messageEl = document.createElement("div");

        messageEl.className = `message message-${incomming ? "from" : "to"}`;
        messageEl.innerHTML = `<p class="message-text">${text}</p>`;

        chatMessagesCtr.appendChild(messageEl);
        this.scrollToBottomOfChat();
    }

    // display the conversation form
    onConversationRating() {
        const noioconnection = JSON.parse(localStorage.getItem("iodisconnected"));
        let chatMessagesCtr = document.querySelector("#chatMessages");
        let checkelet = document.querySelector(".goodrating");
        let rmelet = document.getElementsByClassName("message-rating")[0];

        if (noioconnection) return;
        if (checkelet) {
            rmelet.parentNode.removeChild(rmelet); //if rating again remove previous one
        }

        const ratingEl = document.createElement("div");
        const ratingup = document.createElement("button");
        const ratingdown = document.createElement("button");

        ratingEl.className = `message message-rating`;
        ratingEl.innerHTML = `<p class="ratingheaderp">Did you find this helpful?</p> <input type="text" class="rating-input" placeholder="enter your comment"/>`;

        ratingup.className = `goodrating`;
        ratingup.innerHTML = `<p class="likebutton"> &#128077; </p>`;

        ratingdown.className = `badrating`;
        ratingdown.innerHTML = `<p class="dislikebutton"> &#128078; </p>`;

        ratingEl.appendChild(ratingup);
        ratingEl.appendChild(ratingdown);

        chatMessagesCtr.appendChild(ratingEl);
        this.scrollToBottomOfChat();
    }

    // after visitor rates the conversation
    onAfterRating(liked) {
        let comment = document.querySelector(".rating-input");
        // do sth here like sending the conversation rating with the comment
        if (liked) {
            this.socket.emit(E.RATECHAT, { rating: 1 }, (err) => {
                if (err) console.log(err);
                else this.appendMessage("Yes, VeryGood!", false);
            });
        }
        else {
            this.socket.emit(E.RATECHAT, { rating: -1 }, (err) => {
                if (err) console.log(err);
                else this.appendMessage("No, Poor", false);
            });
        }
    }

    async onSubmitOfflineMessage() {
        let offline_email = document.querySelector('.offline-email').value;
        let offline_input = document.querySelector('.offline-input').value;
        let offline_name = document.querySelector('.offline-name').value;
        let offline_subject = document.querySelector('.offline-subject').value;

        const mail = {
            email: offline_email,
            name: offline_name,
            subject: offline_subject,
            text: offline_input
        }

        if (isEmail(offline_email) && isNonEmptyString(offline_input) && isFullName(offline_name) && isNonEmptyString(offline_subject)) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mail),
            };

            let response = await fetch(`${API_SERVER_URL}/visitor/${this.projectID}/offlineMessage`, requestOptions);
            // console.log(response);
            if (response.ok) {
                this.disableOfflineMessage();
                console.log("disable now");
                // return response.json();
            } else {
                throw new Error("something went wrong on sending email!!");
            }
        }
    }

    offlineFormDisplay() {
        if (document.querySelector('#message-offline')) return;
        let chatMessagesCtr = document.querySelector("#chatMessages");
        const offlineEl = document.createElement("div");

        offlineEl.className = `message message-offline`;
        offlineEl.id = `message-offline`;
        offlineEl.innerHTML = `<p class="ratingheaderp">We are offline now. we will reply via email please leave here your email and your message your email and your message </p><input type="text" class="offline-name" placeholder="Jhon doe"/> <input type="email" class="offline-email" placeholder="email@example.com"/><input type="text" class="offline-subject" placeholder="Enter subject here"/> <input type="text" class="offline-input" placeholder="your message here..."/><button class="offline-button">send</button>`;

        chatMessagesCtr.appendChild(offlineEl);
        this.scrollToBottomOfChat();
    }

    removeOfflineForm() {
        let rmform = document.getElementsByClassName("message-offline")[0];
        if (rmform) {
            rmform.parentNode.removeChild(rmform);
        }
    }

    disableOfflineMessage() {
        document.querySelector(".offline-email").disabled = true;
        document.querySelector(".offline-name").disabled = true;
        document.querySelector(".offline-subject").disabled = true;
        document.querySelector(".offline-input").disabled = true;
        document.querySelector(".offline-button").disabled = true;
    }

    // for the launcher button if you want to display the chat or minimize
    onToggleWidget() {
        let x = document.getElementById("chat-container");
        let y = document.getElementById("widgetimageicon");
        let msgemitseen = localStorage.getItem("LSTMSGID");

        if (x.style.display === "none") {
            x.style.display = "flex";
            y.src = `${CHAT_ASSET_SERVER_URL}/images/smsinactiveicon.png`;
            this.countNotification();
            this.scrollToBottomOfChat();
            if (msgemitseen) this.socket.emit(E.MESSAGESEEN, { messageID: msgemitseen });
        }
        else {
            if (x.style.display === "flex") {
                x.style.display = "none";
                y.src = `${CHAT_ASSET_SERVER_URL}/images/smsactiveicon.png`;
            }
            else {
                x.style.display = "none";
                y.src = `${CHAT_ASSET_SERVER_URL}/images/smsactiveicon.png`;
            }
        }
    }

    scrollToBottomOfChat() {
        let chatMessagesCtr = document.querySelector("#chatMessages");
        chatMessagesCtr.scrollTop = chatMessagesCtr.scrollHeight - chatMessagesCtr.clientHeight;
    }

    // for enabling and disabling notification option
    onNotification() {
        let getnotified = JSON.parse(localStorage.getItem("NotificationEnabled"));
        let enabledisabletext = document.querySelector("#enabledisable");

        if (getnotified) {
            enabledisabletext.textContent = "Notification on";
            localStorage.setItem("NotificationEnabled", false);
        }
        else {
            enabledisabletext.textContent = "Notification off";
            localStorage.setItem("NotificationEnabled", true);
        }
    }

    // for the count increament and visibility on the badge
    countNotification() {
        let notifymebadge = document.getElementById("notificationbadge");
        let visiblityc = document.getElementById("chat-container");
        let option = JSON.parse(localStorage.getItem("NotificationEnabled"));

        if (option) {
            if (visiblityc.style.display === "none") {
                notifymebadge.style.display = "block";
                this.notificationcount = this.notificationcount + 1;
                notifymebadge.innerHTML = this.notificationcount + "";
            }
            else {
                notifymebadge.style.display = "none";
                this.notificationcount = 0;
                notifymebadge.innerHTML = "";
            }
        }
        else {
            this.notificationcount = 0;
            notifymebadge.innerHTML = "";
            notifymebadge.style.display = "none";
        }
    }

    // when visitor sends message
    onSend() {
        let messageInput = document.querySelector("#messageInput");
        const noioconnection = JSON.parse(localStorage.getItem("iodisconnected"));

        if (noioconnection) return;
        if (!messageInput.value) return;

        const msg = { text: messageInput.value, time: Date.now() };
        this.socket.emit(E.MESSAGE, msg, (err, result) => {
            if (err) console.log(err);
            else {
                this.appendMessage(messageInput.value, false);
                messageInput.value = "";
            }
        });
    }

    leaveChat() {
        this.socket.emit(E.LEAVECHAT);
    }

    startConversation() {
        const visitoremail = localStorage.getItem("visitoremail");
        this.socket.emit(E.STARTCONVERSATION, { email: visitoremail }, (err) => {
            if (err) console.log("onstartconv err ",err);
        });
    }

    closeConnection() {
        this.socket.disconnect(); // maybe.
    }

    // -------------------- socket io handlers --------------------
    onMessage(msg) {
        //msg may also contain file: {mime, name, size, url}
        let chatscreen = document.getElementById("chat-container").style.display;
        if (msg.sender) {
            if (msg.sender.agent) {
                this.appendMessage(msg.text, true);
                this.countNotification();
                if (chatscreen == "flex") this.socket.emit(E.MESSAGESEEN, { messageID: msg.messageID });
                else localStorage.setItem("LSTMSGID", msg.messageID);
            }
            else if (msg.sender.visitor) {
                this.appendMessage(msg.text, false);
            }
        }
    }

    visitorTyping(message, ispreview) {
        const preview = { text: message };
        if (ispreview) {
            this.socket.emit(E.SNEAKPREVIEW, preview);
        }
        else {
            this.socket.emit(E.VISITORTYPING);
        }
    }

    onAgentssigned(agent) {
        const { name, avatarURL } = agent;
        let agentName = document.querySelector("#agent_Name");
        agentName.innerHTML = name + "";
    }

    onChatClosed() {
        let agentName = document.querySelector("#agent_Name");
        agentName.innerHTML = "Hi there";
    }

    onConversationStarted() {
        // const regform = document.querySelector('#register-container');
        // if(regform) regform.style.display = 'none';
        // document.querySelector('#chat-container').style.display = 'block';
        // localStorage.setItem("iodisconnected", false);
    }

    onOnline() {
        console.log("online..");
        this.removeOfflineForm();
        document.getElementById("onoffindicatoroff").id = "onoffindicatoron";
        localStorage.setItem("iodisconnected", false);

        document.querySelector('#messageInput').style.display = 'block';
        document.querySelector('#triggerpickerbtn').style.display = 'block';
        document.querySelector('#rating').style.display = 'block';
    }

    onOffline() {
        let icon = document.getElementById("onoffindicatoron");
        let widget = document.getElementById("chat-container");

        this.offlineFormDisplay();
        if (icon) {
            document.getElementById("onoffindicatoron").id = "onoffindicatoroff";
        }
        localStorage.setItem("iodisconnected", true);

        document.querySelector('#messageInput').style.display = 'none';
        document.querySelector('#triggerpickerbtn').style.display = 'none';
        document.querySelector('#rating').style.display = 'none';

        if (SETTINGS.hideWidgetWhenOffline) { widget.style.display = 'none'; }
    }

    onConnect() {
        localStorage.setItem("iodisconnected", false);
        console.log("socket connected to server");
    }

    onReconnect() {
        // console.log()
    }

    onDisconnect() {
        localStorage.setItem("iodisconnected", true);
        console.log("iodisconnected");
    }

    onError(err) {
        console.log(err);
    }
}

export default Visitor;