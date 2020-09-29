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
        }, 1000);
        this.notificationcount = 0;
        this.projectID = PROJECT_ID;
    }

    enforceProjectSettings() {
        if (SETTINGS.hideWidgetOnMobile) { }
        if (SETTINGS.fileUploadAllowed) { }
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

    fetchHistoryIfPossible() {
        const token = this.getCookie('conversationToken');
        if (token) {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                    fetchedHistoryCount: "0"
                }
            };

            fetch(`${API_SERVER_URL}/visitor/history`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const temp = data.data.history;
                        for (let j = 0; j < temp.length; j++) {
                            if (temp[j].sender.agent) {
                                this.appendMessage(temp[j].text, true);
                            }
                            else if (temp[j].sender.visitor) {
                                this.appendMessage(temp[j].text, false);
                            }
                        }
                    }
                    else console.log("fetch history error");
                });
        }
    }

    setupSocket() {
        const token = this.getCookie('conversationToken');
        const browserID = localStorage.getItem('browserID');

        const visitorQuery = {
            usertype: 'visitor',
            token: token,
            browserID: browserID,
            projectID: this.projectID,
        };

        this.socket = io(CHAT_SERVER_URL, { query: visitorQuery, forceNew: true });

        this.socket.on(E.AGENTASSIGNED, this.onAgentssigned.bind(this));
        this.socket.on(E.AGENTLEFT, this.onAgentLeft.bind(this));
        this.socket.on(E.MESSAGE, this.onMessage.bind(this));
        this.socket.on(E.OFFLINE, this.onOffline.bind(this));
        this.socket.on(E.TOKEN, this.onToken.bind(this));
        this.socket.on(E.ONLINE, this.onOnline.bind(this));

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
        const token = this.getCookie('conversationToken');
        if (token) return;
        this.socket.emit(E.STARTCONVERSATION, { email: visitoremail }, (err) => {
            if (err) console.log(err);
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

    onAgentLeft() {
        let agentName = document.querySelector("#agent_Name");
        agentName.innerHTML = "Hi there";
    }

    onToken(auth) {
        const { token } = auth;
        const regform = document.querySelector('#register-container');
        
        if(regform) regform.style.display = 'none';
        document.querySelector('#chat-container').style.display = 'block';

        this.setCookie("conversationToken", token, 365);
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

    // -------------------------------------- cookie related ------------------------
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
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
}

export default Visitor;