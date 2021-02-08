const { createRequire } = require("module");
const NandBox = require("nandbox-bot-api/src/NandBox");
const Nand = require("nandbox-bot-api/src/NandBoxClient");
const NandBoxClient = Nand.NandBoxClient;
const TextOutMessage = require("nandbox-bot-api/src/outmessages/TextOutMessage");
const Button = require("nandbox-bot-api/src/data/Button");
const Menus = require("./Menus");

const MenuItems = require("./MenuItems");
const SetNavigationButtonOutMessage = require("nandbox-bot-api/src/outmessages/SetNavigationButtonOutMessage");
const Utils = require("nandbox-bot-api/src/util/Utility");
const db = require("./db")
const data = require("./data.json")
const Id = Utils.Id;



const commands = require("./commands")
//const funcs = require("./funcs")

//Bot related
const configFile = require("./config.json");
const IncomingMessage = require("nandbox-bot-api/src/inmessages/IncomingMessage");
const TOKEN = configFile.TOKEN.toString();
const config = {
    URI: configFile.URI,
    DownloadServer: configFile.DownloadServer,
    UploadServer: configFile.UploadServer
}


var client = NandBoxClient.get(config);
var nandbox = new NandBox();
var nCallBack = nandbox.Callback;
var api = null;

//DB
const dataBase = new db(data.dbPath);

let chatToState = {};



nCallBack.onConnect = (_api) => {
    // it will go here if the bot connected to the server successfuly 
    api = _api;
    console.log("Authenticated");

    //initialize the database in case the tables were not already created (first time)
    dataBase.createRecordTable();
    dataBase.createCurrentlyPlayingTable();
}

nCallBack.onReceive = incomingMsg => {
    let chatId = incomingMsg.chat.id;
    //check is it's the start command
    let isCommand = false;
    for(commandKey in commands)
    {
        let regex = commands[commandKey].regex
        if(regex.test(incomingMsg.text))
        {
            isCommand = true;
            break;
        }
    }

    if(isCommand)
    {
        switch (commandKey)
        {
            case "start":
                if(!(chatId in chatToState))
                {
                    
                    //reference = Id();
                    MenuItems.newGameMenuItems.actions.item5(chatId,api,incomingMsg.from.name,incomingMsg.from.id,null,chatToState,dataBase)
                    dataBase.addInitialRecord(chatId,incomingMsg.from.name)
                }
                break;
            default:
                break;
        }
        return;
    }



}

// implement other nandbox.Callback() as per your bot need
nCallBack.onReceiveObj = obj => {
    console.log("received object: ", obj);
}

nCallBack.onClose = () => { }
nCallBack.onError = () => { }




nCallBack.onChatMenuCallBack = chatMenuCallback => {

    let callBack = chatMenuCallback.button_callback;
    let chatId = chatMenuCallback.chat.id;
    //let userId = chatMenuCallback.from.id;
    //let reference = Id();

    let validItems = {}

    if((chatId in chatToState)){
        let state = chatToState[chatId].state;
        
        switch (state)
        {
            //difficulty selection menu
            case 1:
                validItems = MenuItems.newGameMenuItems;
                break
            //game menu
            case 2:
                validItems = MenuItems.gameMenuItems;
            default:
                break;
        }
    }
    else
    {
        validItems = MenuItems.startMenuItems;
    }

    for(key in validItems.callBacks)
    {
        let menuItem = validItems.callBacks[key];
        if(callBack === menuItem)
        {
            //perform the action related to that item

            validItems.actions[key](chatId,api,chatMenuCallback.from.name,chatMenuCallback.from.id,callBack,chatToState,dataBase)
            if(chatId in chatToState)
            {
                chatToState[chatId].state = validItems.state[key]
            }
            return
        }
    }

    //FUNCTION
    //This means that the bot went down and came back, while the user was in a state that is either 1 or 2
    //MenuItems.newGameMenuItems.actions.item5(chatId,api,chatMenuCallback.from.name,chatMenuCallback.from.id,null,chatToState,dataBase)
    //Send an apology message to explain what happened
    let outMsg = new TextOutMessage();
    outMsg.chat_Id = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = chatMenuCallback.from.id;
    outMsg.text = `The bot went down and came back up, so You were taken back to the main menu. Sorry for any inconvenience.`
    api.send(JSON.stringify(outMsg));
    setTimeout(function(){
        MenuItems.newGameMenuItems.actions.item5(chatId,api,chatMenuCallback.from.name,chatMenuCallback.from.id,callBack,chatToState,dataBase)
    },200)
    

}





nCallBack.onInlineMessageCallback = inlineMsgCallback => {
    let chatId = inlineMsgCallback.chat.id;

    dataBase.isCurrentlyPlaying(chatId).then((res) => {
        if(res)
        {
            if(chatId in chatToState)
            {
                let userId = inlineMsgCallback.from.id;
                let state = chatToState[chatId].state;
                let msgId = inlineMsgCallback.message_id;
                let reference = inlineMsgCallback.reference;
                let callBack = inlineMsgCallback.button_callback;
                if(state === 2 && reference == chatToState[chatId].activeGameRef)
                {
                    let validItems = MenuItems.keypadMenuItems
                    for(key in validItems.callBacks)
                    {
                        let menuItem = validItems.callBacks[key];
                        if(callBack === menuItem)
                        {
                            validItems.actions[key](chatId,api,chatToState[chatId].name,userId,callBack,chatToState,msgId,reference,dataBase)
                            break
                        }
                    }
                }
            }
            else
            {
                //Send an apology message to explain what happened
                let outMsg = new TextOutMessage();
                outMsg.chat_Id = chatId;
                outMsg.reference = Id();
                outMsg.to_user_id = inlineMsgCallback.from.id;
                outMsg.text = `The bot went down and came back up, so you were taken back to the main menu. Sorry for any inconvenience.`
                api.send(JSON.stringify(outMsg));
                setTimeout(function(){
                    MenuItems.newGameMenuItems.actions.item5(chatId,api,inlineMsgCallback.from.name,inlineMsgCallback.from.id,null,chatToState,dataBase)
                },200)
                
                dataBase.removeCurrentlyPlaying(chatId)

                return
            }
            
        }
    })
        

}
nCallBack.onMessagAckCallback = msgAck => {}

nCallBack.onUserJoinedBot = user => {
}

nCallBack.onChatMember = chatMember => {}


nCallBack.onChatAdministrators = chatAdministrators => {}


nCallBack.userStartedBot = user => { }
nCallBack.onMyProfile = user => { }
nCallBack.onUserDetails = user => { }
nCallBack.userStoppedBot = user => { }
nCallBack.userLeftBot = user => { }
nCallBack.permanentUrl = permenantUrl => { }
nCallBack.onChatDetails = chat => { }
nCallBack.onInlineSearh = inlineSearch => { }
nCallBack.onBlackList = blackList => { }
nCallBack.onWhiteList = whiteList => { }

client.connect(TOKEN, nCallBack);