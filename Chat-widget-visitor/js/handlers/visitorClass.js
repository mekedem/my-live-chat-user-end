class Visitor {

    constructor(agency) {
        this.room = null;
        this.insureBrowserID();
        this.fetchHistoryIfPossible();
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

    fetchHistoryIfPossible(){
        const token = this.getCookie('conversationToken');
        if(token){
        const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
              getTheLast: "2",
              fetchedHistoryCount:"0"
            }
          };
          
        fetch(`http://localhost:5000/visitor/history`,requestOptions)
                .then(response => response.json())
                .then(data => {
                    if(data.success){
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
                    else{
                        console.log("fetch history error");
                    }
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
            projectID: '5f6118297247cf454c39d388',
        };

        this.socket = io('http://localhost:5000', { query: visitorQuery, forceNew: true });
        this.startConversation();

        this.socket.on(E.AGENTASSIGNED, this.onAgentssigned.bind(this));
        this.socket.on(E.AGENTLEFT, this.onAgentLeft.bind(this));
        this.socket.on(E.MESSAGE, this.onMessage.bind(this));
        this.socket.on(E.OFFLINE, this.onOffline.bind(this));
        this.socket.on(E.TOKEN, this.onToken.bind(this));
        this.socket.on(E.ONLINE, this.onOnline.bind(this));

        // reserved event names.
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('error', this.onError.bind(this));

        //onsending message
        let sendMessageForm = document.querySelector("#messageSendForm");
        let customwidget = document.querySelector("#customwidget");

        //on options
        let notification = document.querySelector("#notification");
        let ratingConv = document.querySelector("#rating");
        
        sendMessageForm.onsubmit = (ev) => { 
            ev.preventDefault();
            this.onSend();
        }

        customwidget.onclick = () => this.onToggleWidget();
        notification.onclick = () => this.onNotification();
        ratingConv.onclick = () => this.onConversationRating();
        
        document.querySelector("#chatMessages").addEventListener('click', (e) => {
            if(e.target.className == 'goodrating') { this.onAfterRating(true); }
            else if(e.target.className == 'likebutton'){ this.onAfterRating(true); }
            else if(e.target.className == 'badrating'){ this.onAfterRating(false); }
            else if(e.target.className == 'dislikebutton'){ this.onAfterRating(false); }
            else{ return }
        });

        document.querySelector('#chatMessages').addEventListener('keypress', (e) => {
            if(e.target.className == 'offline-input'){
                if(e.key === 'Enter'){ this.onSubmitOfflineMessage(); }
            }
        });

        document.querySelector('#messageInput').addEventListener('input', (e) => { 
            this.visitorTyping(e.target.value, false);
            setTimeout(()=>{
                this.visitorTyping(e.target.value, true);
            },1000) 
        });
    }

    appendMessage(text, incomming) {
        let chatMessagesCtr = document.querySelector("#chatMessages");
        const messageEl = document.createElement("div");

        messageEl.className = `message message-${incomming ? "from" : "to"}`;
        messageEl.innerHTML = `<p class="message-text">${text}</p>`;
        
        chatMessagesCtr.appendChild(messageEl);
        chatMessagesCtr.scrollTop = chatMessagesCtr.scrollHeight - chatMessagesCtr.clientHeight;
    }

    onAfterRating(liked){
        let comment = document.querySelector(".rating-input");
        // do sth here like sending the conversation rating with the comment
        if(liked){
            this.appendMessage("Yes, VeryGood!", false);
        }
        else{
            this.appendMessage("No, Poor", false);
        }
    }

    onSubmitOfflineMessage(){
        let offline_email = document.querySelector('.offline-email').value;
        let offline_input = document.querySelector('.offline-input').value;

        if(offline_email && offline_input){
            // console.log("hedech alugn");
        }
    }

    onConversationRating(){
        let chatMessagesCtr = document.querySelector("#chatMessages");
        let checkelet = document.querySelector(".goodrating");
        let rmelet = document.getElementsByClassName("message-rating")[0];
     
        const ratingEl = document.createElement("div");
        const ratingup = document.createElement("button");
        const ratingdown = document.createElement("button");

        if(checkelet){
            rmelet.parentNode.removeChild(rmelet); //if rating again remove previous one
        }

        ratingEl.className = `message message-rating`;
        ratingEl.innerHTML = `<p class="ratingheaderp">Did you find this helpful?</p> <input type="text" class="rating-input" placeholder="enter your comment"/>`;

        ratingup.className = `goodrating`;
        ratingup.innerHTML = `<p class="likebutton"> &#128077; </p>`;

        ratingdown.className = `badrating`;
        ratingdown.innerHTML = `<p class="dislikebutton"> &#128078; </p>`;
        
        ratingEl.appendChild(ratingup);
        ratingEl.appendChild(ratingdown);

        chatMessagesCtr.appendChild(ratingEl);
        chatMessagesCtr.scrollTop = chatMessagesCtr.scrollHeight - chatMessagesCtr.clientHeight;
    }

    // for the launcher button if you want to display the chat or minimize
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

    offlineFormDisplay(){
        let chatMessagesCtr = document.querySelector("#chatMessages");
        const offlineEl = document.createElement("div");

        offlineEl.className = `message message-offline`;
        offlineEl.innerHTML = `<p class="ratingheaderp">We are offline now. we will reply via email please leave here your email and your message your email and your message </p> <input type="email" class="offline-email" placeholder="email@example.com"/> <input type="text" class="offline-input" placeholder="message here..."/>`;

        chatMessagesCtr.appendChild(offlineEl);
        chatMessagesCtr.scrollTop = chatMessagesCtr.scrollHeight - chatMessagesCtr.clientHeight;
    }

    removeOfflineForm(){
        let rmform = document.getElementsByClassName("message-offline")[0];
        if(rmform){
            rmform.parentNode.removeChild(rmform);
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

    // for the count increament and visibility on the badge
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
        const token = this.getCookie('conversationToken');
        if(token) return;
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

    visitorTyping(message, ispreview){
        const preview = { text: message };
        if(ispreview){
            this.socket.emit(E.SNEAKPREVIEW, preview);
        }
        else{
            this.socket.emit(E.VISITORTYPING);
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
        console.log("token : metual : ", token);
    }

    onOnline(){
        this.removeOfflineForm();
        // offline online icon toggle
    }

    onOffline() {
        // offline online icon toggle
        this.offlineFormDisplay();
        // console.log("offline nen bakih");
    }

    onConnect() {
        console.log("socket connected to server");
    }

    onReconnect() {
        // console.log()
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