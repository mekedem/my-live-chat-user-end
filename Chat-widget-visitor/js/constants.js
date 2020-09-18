const E = {
    MESSAGE: 'MESSAGE',
    MESSAGESEEN: 'MESSAGESEEN',
    AGENTASSIGNED: 'AGENTASSIGNED',
    ROOMASSIGNED: 'ROOMASSIGNED',
    NEWCHATASSIGNED: 'NEWCHATASSIGNED',

    TOKEN: 'TOKEN',
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    STARTCONVERSATION: 'STARTCONVERSATION',
    VISITORCONNECTED: 'VISITORCONNECTED',
    VISITORDISCONNECTED: 'VISITORDISCONNECTED',
    VISITORLEFTCHAT: 'VISITORLEFTCHAT',
    LEAVECHAT: 'LEAVECHAT',
    AGENTLEFT: 'AGENTLEFT',
    JOINCHAT: 'JOINCHAT',
    VISITORTYPING: 'VISITORTYPING',
    SNEAKPREVIEW: 'SNEAKPREVIEW'
};

const SETTINGS = {
    active: true,
    waitTime: 2000,
    soundNotification: false,
    browserTabNotification: false,
    showAgentTyping: false,
    showVisitorTyping: true,
    sneakPreview: true,
    hideWidgetWhenOffline: false,
    hideWidgetOnMobile: false,
    fileUploadAllowed: false,
    chatRatingAllowed: true,
    emojiInChatAllowed: true,
};