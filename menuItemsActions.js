const TextOutMessage = require("nandbox-bot-api/src/outmessages/TextOutMessage");
const SetChatMenuOutMessage = require("nandbox-bot-api/src/outmessages/SetChatMenuOutMessage");
const UpdateOutMessage = require("nandbox-bot-api/src/outmessages/UpdateOutMessage");
const Menus = require("./Menus");
const funcs = require("./funcs");
const Utils = require("nandbox-bot-api/src/util/Utility");
const MenuItems = require("./MenuItems");
let fs = require('fs')
const data = require("./data.json")
const Id = Utils.Id;

exports.newGame = (chatId,api,name,toUserId,callBack,chatToState) =>{

    chatToState[chatId] = {
        state:1,
        gameState:{
            correctNumber:0,
            currentIndex:4,
            difficulty:0,
            maxIndex:0,
            currentTrial:1,
            usedHints:0,
            currentText:""
        },
        name:name,
        activeGameRef:0
    }

    //create out msg
    let outMsg = new TextOutMessage();
    outMsg.chatId = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = toUserId;
    outMsg.text = "Please choose a difficulty"
    api.send(JSON.stringify(outMsg));

} 

exports.start = (chatId,api,name,toUserId,callBack,chatToState) =>{

    if(chatId in chatToState)
    {
        delete chatToState[chatId]
    }
    //create out msg

    let outMsg = new TextOutMessage();
    outMsg.chat_Id = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = toUserId;
    outMsg.text = `Welcome to the "Digital Master Mind"`
    api.send(JSON.stringify(outMsg));

    

    //create new menu
    let menu = new SetChatMenuOutMessage()
    funcs.setNavigationButton(chatId, "startMenu", api);
    menu.chat_id = chatId;
    menu.menus = [Menus.startMenu,Menus.newGameMenu,Menus.gameMenu];
    api.send(JSON.stringify(menu))
    
}

exports.startGame = (chatId,api,name,toUserId,callBack,chatToState,dataBase) =>{

    dataBase.addCurrentlyPlaying(chatId);

    let outMsg = new TextOutMessage();
    outMsg.chatId = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = toUserId;
    if(callBack == "low")
    {
        outMsg.text = `Let's go, guess a number!\n✔️ four digits\n✔️ 1 to 9\n✔️ repeats not allowed`;
    }
    else if(callBack == "medium")
    {
        outMsg.text = `Let's go, guess a number!\n✔️ four digits\n✔️ 0 to 9\n✔️ repeats not allowed`;
    }
    else if(callBack == "hard")
    {
        outMsg.text = `Let's go, guess a number!\n✔️ four digits\n✔️ 0 to 9\n✔️ repeats allowed`;
    }
    else if(callBack == "impossible")
    {
        outMsg.text = `Let's go, guess a number!\n✔️ five digits\n✔️ 0 to 9\n✔️ repeats allowed`;
    }
    
    api.send(JSON.stringify(outMsg));

    outMsg = new TextOutMessage();
    outMsg.chatId = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = toUserId;
    if(callBack != "impossible")
    {
        outMsg.text = `1.  _ _ _ _`;
    }
    else
    {
        outMsg.text = `1.  _ _ _ _ _`
    }
    
    outMsg.menu_ref = MenuItems.keypadMenuItems.reference
    outMsg.inline_menu = Menus.keypadMenu
    setTimeout(function(){
        api.send(JSON.stringify(outMsg));
    },200)
    


    if(callBack == "low" || callBack == "medium" || callBack == "hard"  || callBack == "impossible")
            {
                chatToState[chatId].activeGameRef = outMsg.reference; 
                chatToState[chatId].gameState.difficulty = callBack;

                if(callBack == "low" || callBack == "medium" || callBack == "hard")
                {
                    chatToState[chatId].gameState.maxIndex = 10;
                    chatToState[chatId].gameState.currentText = "1.  _ _ _ _";
                    let min = 1
                    let max = 9
                    if(callBack != "low")
                    {
                        min = 0;
                    }

                    let size = 4;
                    let correctNumber = ""
                    for(i=0;i<size;i++)
                    {
                        let digit = funcs.generateRandomNumber(min,max)
                        while((callBack == "low" || callBack == "medium") && correctNumber.includes(digit.toString()))
                        {
                            digit = funcs.generateRandomNumber(min,max)
                        }
                        correctNumber = correctNumber + digit.toString();
                    }
                    chatToState[chatId].gameState.correctNumber = correctNumber
                    
                }
                else
                {
                    chatToState[chatId].gameState.maxIndex = 12;
                    chatToState[chatId].gameState.currentText = "1.  _ _ _ _ _";

                    let min = 0
                    let max = 9

                    let size = 5;
                    let correctNumber = ""
                    for(i=0;i<size;i++)
                    {
                        let digit = funcs.generateRandomNumber(min,max)
                        correctNumber = correctNumber + digit.toString();
                    }
                    chatToState[chatId].gameState.correctNumber = correctNumber
                }

                
            }
}


exports.keypadNumber = (chatId,api,name,toUserId,callBack,chatToState,msgId,reference) =>{
            let currentIndex = chatToState[chatId].gameState.currentIndex;
            let maxIndex = chatToState[chatId].gameState.maxIndex;
            if(currentIndex <= maxIndex)
            {
                let currentText = chatToState[chatId].gameState.currentText;
                let newText = currentText.slice(0,currentIndex)+callBack+currentText.slice(currentIndex+1)
                currentText = newText;
                let updateMsg = new UpdateOutMessage();
                updateMsg.message_id = msgId;
                updateMsg.chat_id=chatId;
                updateMsg.reference=reference;
                updateMsg.to_user_id=toUserId;
                updateMsg.text = currentText;
                updateMsg.menu_ref = MenuItems.keypadMenuItems.reference
                updateMsg.inline_menu = Menus.keypadMenu
                api.send(JSON.stringify(updateMsg));
                
                chatToState[chatId].gameState.currentIndex = currentIndex + 2;
                chatToState[chatId].gameState.currentText = currentText;
            }
}

exports.keypadDelete = (chatId,api,name,toUserId,callBack,chatToState,msgId,reference) =>{

    let currentIndex = chatToState[chatId].gameState.currentIndex;
            console.log(currentIndex)
            if(currentIndex > 4)
            {
                
                let currentText = chatToState[chatId].gameState.currentText;
                currentIndex -= 2
                chatToState[chatId].gameState.currentIndex = currentIndex;
                let newText = currentText.slice(0,currentIndex)+"_"+currentText.slice(currentIndex+1)
                currentText = newText;
                console.log(currentText)
                let updateMsg = new UpdateOutMessage();
                updateMsg.message_id = msgId;
                updateMsg.chat_id=chatId;
                updateMsg.reference=reference;
                updateMsg.to_user_id=toUserId;
                updateMsg.text = currentText;
                updateMsg.menu_ref = MenuItems.keypadMenuItems.reference
                updateMsg.inline_menu = Menus.keypadMenu
                api.send(JSON.stringify(updateMsg));
                
                chatToState[chatId].gameState.currentText = currentText;
            }
}


exports.keypadEnter = (chatId,api,name,toUserId,callBack,chatToState,msgId,reference,dataBase) =>{

    let difficulty = chatToState[chatId].gameState.difficulty;
    let currentIndex = chatToState[chatId].gameState.currentIndex;
    let maxIndex = chatToState[chatId].gameState.maxIndex;
    let usedHints = chatToState[chatId].gameState.usedHints;
    console.log(`current index: ${currentIndex}`)
    console.log(`max index: ${maxIndex}`)
    
    
    if(currentIndex == maxIndex + 2)
    {
        console.log("Doing sth")
        let currentText = chatToState[chatId].gameState.currentText;
        let numOfDigits = 4
        let correctNumber = chatToState[chatId].gameState.correctNumber;
        if(chatToState[chatId].gameState.difficulty == "impossible")
        {
            numOfDigits = 5;
        }

        let lastIndexOfNewline = currentText.lastIndexOf("\n")
        if(usedHints != 0)
        {
            lastIndexOfNewline = currentText.slice(0,lastIndexOfNewline).lastIndexOf("\n")
        }
        let currentNumber = funcs.numberFromText(currentText.slice(lastIndexOfNewline == -1?0:lastIndexOfNewline+1),numOfDigits);
        let numberOfMatches = funcs.getNumberOfMatches(currentNumber,correctNumber.toString(),numOfDigits);
        let numberOfExactMatches = funcs.getNumberOfExactMatches(currentNumber,correctNumber.toString(),numOfDigits);

        if(numberOfExactMatches == numOfDigits)
        {
            console.log("won")
            if(usedHints == 0)
            {
                currentText = funcs.addNewSentence(currentText,`  ${numberOfMatches}:${numberOfExactMatches}`);
            }
            else
            {
                currentText = funcs.addNewSentence(currentText,`  ${numberOfMatches}:${numberOfExactMatches}`,true)
            }
            
            chatToState[chatId].gameState.currentText = currentText

            let updateMsg = new UpdateOutMessage();
            updateMsg.message_id = msgId;
            updateMsg.chat_id=chatId;
            updateMsg.reference=reference;
            updateMsg.to_user_id=toUserId;
            updateMsg.text = currentText;
            api.send(JSON.stringify(updateMsg));

            let outMsg = new TextOutMessage()
            outMsg.chat_id = chatId;
            outMsg.reference = Id();
            outMsg.to_user_id = toUserId;
            outMsg.text = `Congratulations! You won. It took you ${chatToState[chatId].gameState.currentTrial} trials to get it right.`
            api.send(JSON.stringify(outMsg))

            dataBase.modifyRecord(chatId,difficulty,true)
            dataBase.removeCurrentlyPlaying(chatId)
            this.start(chatId,api,name,toUserId,callBack,chatToState)
            

            
            
        }
        else
        {
            console.log("didn't win")

            let lastIndexOfNewline = currentText.lastIndexOf("\n")
            if(usedHints != 0)
            {
                lastIndexOfNewline = currentText.slice(0,lastIndexOfNewline).lastIndexOf("\n")
            }
            let currentNumber = funcs.numberFromText(currentText.slice(lastIndexOfNewline == -1?0:lastIndexOfNewline+1),numOfDigits);   
            
            if((difficulty == "low" || difficulty == "medium") && funcs.containsRepetitions(currentNumber,numOfDigits))
            {
                let outMsg = new TextOutMessage()
                outMsg.chat_id = chatId;
                outMsg.reference = Id();
                outMsg.to_user_id = toUserId;
                outMsg.text = `Multiple digits are not allowed for this level of difficulty. Please try again.`
                api.send(JSON.stringify(outMsg))
                return;
            }
            else if(difficulty == 'low' && funcs.containsZeros(currentNumber))
            {
                let outMsg = new TextOutMessage()
                outMsg.chat_id = chatId;
                outMsg.reference = Id();
                outMsg.to_user_id = toUserId;
                outMsg.text = `0 is not allowed for this level of difficulty. Please try again.`
                api.send(JSON.stringify(outMsg))
                return;
            }
            chatToState[chatId].gameState.currentIndex = currentIndex + 9;
            chatToState[chatId].gameState.maxIndex = chatToState[chatId].gameState.currentIndex + ((numOfDigits-1)*2)
            chatToState[chatId].gameState.currentTrial = chatToState[chatId].gameState.currentTrial + 1;

            if(chatToState[chatId].gameState.difficulty != "impossible")
            {
                
                if(usedHints == 0)
                {
                    currentText = funcs.addNewSentence(currentText,`  ${numberOfMatches}:${numberOfExactMatches}`)
                    currentText = funcs.addNewLine(currentText,`${chatToState[chatId].gameState.currentTrial}.  _ _ _ _`)
                }
                else
                {
                    currentText = funcs.addNewSentence(currentText,`  ${numberOfMatches}:${numberOfExactMatches}`,true)
                    currentText = funcs.addNewLine(currentText,`${chatToState[chatId].gameState.currentTrial}.  _ _ _ _`,true)
                }
                
                chatToState[chatId].gameState.currentText = currentText
            }
            else
            {
                
                if(usedHints == 0)
                {
                    currentText = funcs.addNewSentence(currentText,`  ${numberOfMatches}:${numberOfExactMatches}`)
                    currentText = funcs.addNewLine(currentText,`${chatToState[chatId].gameState.currentTrial}.  _ _ _ _ _`)
                }
                else
                {
                    currentText = funcs.addNewSentence(currentText,`  ${numberOfMatches}:${numberOfExactMatches}`,true)
                    currentText = funcs.addNewLine(currentText,`${chatToState[chatId].gameState.currentTrial}.  _ _ _ _ _`,true)
                }
                
                chatToState[chatId].gameState.currentText = currentText
            }
            

            let updateMsg = new UpdateOutMessage();
            updateMsg.message_id = msgId;
            updateMsg.chat_id=chatId;
            updateMsg.reference=reference;
            updateMsg.to_user_id=toUserId;
            updateMsg.text = currentText;
            updateMsg.menu_ref = MenuItems.keypadMenuItems.reference
            updateMsg.inline_menu = Menus.keypadMenu
            api.send(JSON.stringify(updateMsg));
            
        }


    }
}

exports.solve = (chatId,api,name,toUserId,callBack,chatToState,dataBase) =>{
    let difficulty = chatToState[chatId].gameState.difficulty;
    let outMsg = new TextOutMessage()
    let correctNumber = chatToState[chatId].gameState.correctNumber
    outMsg.chat_id = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = toUserId;
    outMsg.text = `The correct answer is ${correctNumber}. Better luck next time!`;
    api.send(JSON.stringify(outMsg));

    dataBase.modifyRecord(chatId,difficulty,false)
    dataBase.removeCurrentlyPlaying(chatId)

    this.start(chatId,api,name,toUserId,callBack,chatToState);
    
}

exports.gameRules = (chatId,api,name,toUserId,callBack,chatToState) =>{
    let outMsg = new TextOutMessage()
    outMsg.chat_id = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = toUserId;
    outMsg.text = `Rules placeholder`;
    
    let filename = data.rules;
    fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    outMsg.text = data;
    api.send(JSON.stringify(outMsg));
    });
    
}

exports.info = (chatId,api,name,toUserId,callBack,chatToState) =>{
    let outMsg = new TextOutMessage()
    outMsg.chat_id = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = toUserId;
    outMsg.text = `info placeholder`;

    let filename = data.info;
    fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    outMsg.text = data;
    api.send(JSON.stringify(outMsg));
    });
}

exports.hint = (chatId,api,name,toUserId,callBack,chatToState,msgId,reference)=>{
    let difficulty = chatToState[chatId].gameState.difficulty
    let usedHints = chatToState[chatId].gameState.usedHints;
    let currentText = chatToState[chatId].gameState.currentText;
    let hintText = ""
    let maxHints = -1;
    console.log("used hints: "+usedHints)

    if(usedHints == 0)
    {
        if(difficulty !== "impossible")
        {
            hintText = "🔍  * * * *"
        }
        else
        {
            hintText = "🔍  * * * * *"
        }
    }
    else
    {
        let magnifyingGlassIndex = currentText.indexOf("🔍");
        hintText = currentText.slice(magnifyingGlassIndex)

    }

    maxHints = data.maxHints;
 
    if(usedHints >= maxHints)
    {
        let outMsg = new TextOutMessage()
        outMsg.chat_id = chatId;
        outMsg.reference = Id();
        outMsg.to_user_id = toUserId;
        outMsg.text = `You can't use anymore hints. You can only use ${maxHints} hints.`;
        api.send(JSON.stringify(outMsg));
        return;
    }


    let revealedNumber = chatToState[chatId].gameState.correctNumber[usedHints];
    let replacedIndex = 4 + (2*usedHints)
    if(usedHints == 0)
    {   
        hintText = funcs.replaceChar(hintText,replacedIndex,revealedNumber)
        currentText = funcs.addNewLine(currentText,hintText)
    }
    else
    {
        console.log(hintText[replacedIndex])
        console.log(replacedIndex)
        hintText = funcs.replaceChar(hintText,replacedIndex,revealedNumber)
        currentText = currentText.replace(/🔍.*/,hintText)
    }

    usedHints += 1;

    chatToState[chatId].gameState.usedHints = usedHints;
    chatToState[chatId].gameState.currentText = currentText;

    let updateMsg = new UpdateOutMessage();
    updateMsg.message_id = msgId;
    updateMsg.chat_id=chatId;
    updateMsg.reference=reference;
    updateMsg.to_user_id=toUserId;
    updateMsg.text = currentText;
    updateMsg.menu_ref = MenuItems.keypadMenuItems.reference
    updateMsg.inline_menu = Menus.keypadMenu
    api.send(JSON.stringify(updateMsg));


}

exports.getRecord = (chatId,api,name,toUserId,callBack,chatToState,dataBase) =>{
    console.log(dataBase)
    dataBase.getAllRecords(chatId).then((res) => {
        
        let totalGames = res[data.recordTableColumns.totalGames];
        let lowGames = res[data.recordTableColumns.lowGames]
        let lowWon = res[data.recordTableColumns.lowWon]
        let lowLost = res[data.recordTableColumns.lowLost]
        let mediumGames = res[data.recordTableColumns.mediumGames]
        let mediumWon = res[data.recordTableColumns.mediumWon]
        let mediumLost = res[data.recordTableColumns.mediumLost]
        let hardGames = res[data.recordTableColumns.hardGames]
        let hardWon = res[data.recordTableColumns.hardWon]
        let hardLost = res[data.recordTableColumns.hardLost]
        let impossibleGames = res[data.recordTableColumns.impossibleGames]
        let impossibleWon = res[data.recordTableColumns.impossibleWon]
        let impossibleLost = res[data.recordTableColumns.impossibleLost]
        
        let messageText = `Your total games played: ${totalGames}\n\n⚪LOW\nGames: ${lowGames}\nLost: ${lowLost}\nWon: ${lowWon}\n\n🔵MEDIUM\nGames:${mediumGames}\nLost:${mediumLost}\nWon: ${mediumWon}\n\n🔴HARD\nGames: ${hardGames}\nLost: ${hardLost}\nWon: ${hardWon}\n\n⚫Impossible\nGames: ${impossibleGames}\nLost: ${impossibleLost}\nWon: ${impossibleWon}`
        let outMsg = new TextOutMessage()
        outMsg.chat_id = chatId;
        outMsg.reference = Id();
        outMsg.to_user_id = toUserId;
        outMsg.text = messageText;
        api.send(JSON.stringify(outMsg));
    }).catch((res)=>{
        let messageText = "Your record isn't being saved. Please type '/start' to save your record."
        let outMsg = new TextOutMessage()
        outMsg.chat_id = chatId;
        outMsg.reference = Id();
        outMsg.to_user_id = toUserId;
        outMsg.text = messageText;
    })
}


exports.getTopRecords = (chatId,api,name,toUserId,callBack,chatToState,dataBase) =>{
    dataBase.getTopLowRecords().then((resLow) => {
        dataBase.getTopMediumRecords().then((resMed) => {
            dataBase.getTopHardRecords().then((resHard) => {
                dataBase.getTopImpossibleRecords().then((resImp) => {
                    let messageText = ""
                    
                    messageText += "Top ⚪LOW Challengers (by wins)\n"

                    let order = 1;
                    for(i = 0; i< resLow.length;i++)
                    {
                        messageText += `${order.toString()}. ${resLow[i].lowWon} - ${resLow[i].name}\n`
                        order += 1;
                    }

                    messageText += "\nTop 🔵MEDIUM Challengers (by wins)\n"

                    order = 1;
                    for(i = 0; i< resMed.length;i++)
                    {
                        messageText += `${order.toString()}. ${resMed[i].mediumWon} - ${resMed[i].name}\n`
                        order += 1;
                    }

                    messageText += "\nTop 🔴HARD Challengers (by wins)\n"

                    order = 1;
                    for(i = 0; i< resHard.length;i++)
                    {
                        messageText += `${order.toString()}. ${resHard[i].hardWon} - ${resHard[i].name}\n`
                        order += 1;
                    }

                    messageText += "\nTop ⚫IMPOSSIBLE Challengers (by wins)\n"

                    order = 1;
                    for(i = 0; i< resImp.length;i++)
                    {
                        messageText += `${order.toString()}. ${resImp[i].impossibleWon} - ${resImp[i].name}\n`
                        order += 1;
                    }

                    messageText = messageText.slice(0,messageText.length-1)
                    let outMsg = new TextOutMessage()
                    outMsg.chat_id = chatId;
                    outMsg.reference = Id();
                    outMsg.to_user_id = toUserId;
                    outMsg.text = messageText;
                    api.send(JSON.stringify(outMsg));
                })
            })
        })
        
    })
}


exports.inviteFriend = (chatId,api,name,toUserId,callBack,chatToState,dataBase) =>{
    let outMsg = new TextOutMessage()
    outMsg.chat_id = chatId;
    outMsg.reference = Id();
    outMsg.to_user_id = toUserId;
    outMsg.text = `You can send my username ' @${data.botName} ' to your friends to let them try me out.`;
    api.send(JSON.stringify(outMsg));
}