const { createRequire } = require("module");
const NandBox = require("nandbox-bot-api/src/NandBox");
const Nand = require("nandbox-bot-api/src/NandBoxClient");
const NandBoxClient = Nand.NandBoxClient;
const TextOutMessage = require("nandbox-bot-api/src/outmessages/TextOutMessage");
const UpdateOutMessage = require("nandbox-bot-api/src/outmessages/UpdateOutMessage");
const Button = require("nandbox-bot-api/src/data/Button");
const Row = require("nandbox-bot-api/src/data/Row");
const Menu = require("nandbox-bot-api/src/data/Menu");
const funcs = require("./funcs");
const Menus = require("./Menus");
const MenuItems = require("./MenuItems");
const SetChatMenuOutMessage = require("nandbox-bot-api/src/outmessages/SetChatMenuOutMessage");
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
const botId = TOKEN.substring(0,TOKEN.indexOf(':'))




var client = NandBoxClient.get(config);
var nandbox = new NandBox();
var nCallBack = nandbox.Callback;
var api = null;

//DB
const dataBase = new db(data.dbPath);
dataBase.createRecordTable();


let chatToState = {};

nCallBack.onConnect = (_api) => {
    // it will go here if the bot connected to the server successfuly 
    api = _api;
    console.log("Authenticated");
}






function setNavigationButton(chatId, nextMenu, api){
    let fb = new Button();
    fb.next_menu = nextMenu;
    let navMsg = new SetNavigationButtonOutMessage();
    navMsg.chat_id = chatId;
    navMsg.navigation_buttons = []
    navMsg.navigation_buttons.push(fb);

    api.send(JSON.stringify(navMsg));
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
                    
                    reference = Id();
                    MenuItems.newGameMenuItems.actions.item5(chatId,api,incomingMsg.from.name,incomingMsg.from.id,null,chatToState,dataBase)
                    console.log(chatToState)
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
    let userId = chatMenuCallback.from.id;
    let reference = Id();
    let validItems = {}

    if((chatId in chatToState)){
        let state = chatToState[chatId].state;
        console.log(`state is ${state}`)
        
        switch (state)
        {
            case 0:
                console.log(`Case 0`)
                validItems = MenuItems.startMenuItems;
                break;
            //new game menu    
            case 1:
                console.log('Case 1')
                validItems = MenuItems.newGameMenuItems;
                break
            //game menu
            case 2:
                console.log('Case 2')
                validItems = MenuItems.gameMenuItems;
            default:
                break;
        }
    }

    console.log(`callback is ${callBack}`)
    for(key in validItems.callBacks)
    {
        console.log(`current item is ${validItems.callBacks[key]}`)
        let menuItem = validItems.callBacks[key];
        if(callBack === menuItem)
        {
            //perform the action related to that item
            console.log(`Menu Item clicked is ${validItems.callBacks[key]}`)

            validItems.actions[key](chatId,api,chatToState[chatId].name,chatMenuCallback.from.id,callBack,chatToState,dataBase)
            chatToState[chatId].state = validItems.state[key]
            console.log(chatToState)
            break
        }
    }


}





nCallBack.onInlineMessageCallback = inlineMsgCallback => {
    let chatId = inlineMsgCallback.chat.id;
    let userId = inlineMsgCallback.from.id;
    let state = chatToState[chatId].state;
    let msgId = inlineMsgCallback.message_id;
    let reference = inlineMsgCallback.reference;
    let callBack = inlineMsgCallback.button_callback;
    console.log(`state is: ${state}`)
    if(state === 2 && reference == chatToState[chatId].activeGameRef)
    {
        let validItems = MenuItems.keypadMenuItems
        for(key in validItems.callBacks)
        {
            console.log(`current item is ${validItems.callBacks[key]}`)
            let menuItem = validItems.callBacks[key];
            if(callBack === menuItem)
            {
                //perform the action related to that item
                console.log(`Menu Item clicked is ${validItems.callBacks[key]}`)

                validItems.actions[key](chatId,api,chatToState[chatId].name,userId,callBack,chatToState,msgId,reference,dataBase)
                //chatToState[chatId].state = validItems.state[key]
                break
            }
        }
    }

        

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