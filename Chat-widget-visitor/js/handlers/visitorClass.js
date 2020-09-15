class Visitor {

    constructor(agency) {
        this.room = null;
        this.insureBrowserID();
        // this.createChatBox();
        setTimeout(() => {
            this.setupSocket();
        }, 1000);
        this.notificationcount = 0;
    }

    insureBrowserID() {
        if (!localStorage.getItem("browserID")) {
            // change this to a more unique id (ex: use UUID)
            const id = Math.random();
            localStorage.setItem("browserID", `${id}`);
            // localStorage.setItem("NotificationEnabled",true);
        } else {
            console.log('got a browserID');
        }
    }

    setupSocket() {
        const token = this.getCookie('conversationToken');
        const browserID = localStorage.getItem('browserID');

        const visitorQuery = {
            usertype: 'visitor',
            token: token,
            browserID: browserID,
            projectID: '5f5d2169c6f5033678f48cfb',
        };

        this.socket = io('http://localhost:5000', { query: visitorQuery, forceNew: true });

        this.socket.on(E.AGENTASSIGNED, this.onAgentssigned.bind(this));
        this.socket.on(E.AGENTLEFT, this.onAgentLeft.bind(this));
        this.socket.on(E.MESSAGE, this.onMessage.bind(this));
        this.socket.on(E.OFFLINE, this.onOffline.bind(this));
        this.socket.on(E.TOKEN, this.onToken.bind(this));

        // reserved event names.
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('error', this.onError.bind(this));

        //onsending message
        let sendMessageForm = document.querySelector("#messageSendForm");
        let customwidget = document.querySelector("#customwidget");
        let notification = document.querySelector("#notification");

        sendMessageForm.onsubmit = (ev) => { 
            ev.preventDefault();
            this.onSend();
        }

        customwidget.onclick = () => this.onToggleWidget();
        notification.onclick = () => this.onNotification();
    }

    appendMessage(text, incomming) {
        let chatMessagesCtr = document.querySelector("#chatMessages");
        const messageEl = document.createElement("div");

        messageEl.className = `message message-${incomming ? "from" : "to"}`;
        messageEl.innerHTML = `<p class="message-text">${text}</p>`;
        
        chatMessagesCtr.appendChild(messageEl);
        chatMessagesCtr.scrollTop = chatMessagesCtr.scrollHeight - chatMessagesCtr.clientHeight;
    }

    onToggleWidget(){
        let x = document.getElementById("chat-container");
        let y = document.getElementById("widgetimageicon");
        
        if (x.style.display === "none") {
            x.style.display = "flex";
            y.src='./smsinactiveicon.png';

            this.countNotification();
        }
        else{
            if(x.style.display === "flex"){
                x.style.display = "none";
                y.src='./smsactiveicon.png';
            }
            else{
                x.style.display = "none";
                y.src='./smsactiveicon.png';
            }
        }
    }

    // for enabling and disabling notification
    onNotification(){
        let getnotified = JSON.parse(localStorage.getItem("NotificationEnabled"));
        let enabledisabletext = document.querySelector("#enabledisable");

        if(getnotified){
            enabledisabletext.textContent = "Notification off";
            localStorage.setItem("NotificationEnabled",false);
        }
        else{
            enabledisabletext.textContent = "Notification on";
            localStorage.setItem("NotificationEnabled",true);
        }
    }

    // for the count on the badge
    countNotification(){
        let notifymebadge = document.getElementById("notificationbadge");
        let visiblityc = document.getElementById("chat-container");
        let option = JSON.parse(localStorage.getItem("NotificationEnabled"));

        if(option){
            if (visiblityc.style.display === "none"){
                notifymebadge.style.display = "block";
                this.notificationcount = this.notificationcount + 1;
                notifymebadge.innerHTML = this.notificationcount + "";   
            }
            else{
                notifymebadge.style.display = "none";
                this.notificationcount = 0;
                notifymebadge.innerHTML = ""; 
            }
        }
        else{
            this.notificationcount = 0;
            notifymebadge.innerHTML = "";
            notifymebadge.style.display = "none";
        }
    }

    onSend() {
        let messageInput = document.querySelector("#messageInput");
        let chatMessagesCtr = document.querySelector("#chatMessages");
        const el = chatMessagesCtr;

        if (!messageInput.value) return;
        const msg = { text: messageInput.value, time: Date.now() };
        this.socket.emit(E.MESSAGE, msg);
        this.appendMessage(messageInput.value, false);
        messageInput.value = "";
    }

    leaveChat() {
        this.socket.emit(E.LEAVECHAT);
    }

    startConversation() {
        const visitoremail = localStorage.getItem("visitoremail");
        this.socket.emit(E.STARTCONVERSATION, { email: visitoremail });
    }

    closeConnection() {
        this.socket.disconnect(); // maybe.
    }

    // -------------------- socket io handlers --------------------
    onMessage(msg) {
        const { text, time } = msg; // may also contain file: {mime, name, size, url}
        if (msg.agentsOnly) {
            // only seen to agents
        }
        if(msg.sender){
            if(msg.sender.agent){
                this.appendMessage(msg.text, true);
                this.countNotification();
                // setNotificationCount(notificationCount => notificationCount + 1);
            }
            else if(msg.sender.visitor){
                this.appendMessage(msg.text, false);
            }
        }
    }

    onAgentssigned(agent) {
        const { name, avatarURL } = agent;
        let agentName = document.querySelector("#agentName");
        agentName.innerHTML = name + "";
        // this.appendMessage(`assigned to agent ${name}`);
    }

    onAgentLeft() {
        let agentName = document.querySelector("#agentName");
        agentName.innerHTML = "";
        // this.appendMessage('agent left the conversation');
    }

    onToken(auth) {
        const { token } = auth;
        this.setCookie("conversationToken",token,365);
    }

    onOffline() {
        // this.appendMessage('agent or agency offline', true);
    }

    onConnect() {
        console.log("socket connected to server");
    }

    onReconnect() {

    }

    onDisconnect() {

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