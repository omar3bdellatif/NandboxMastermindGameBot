const Button = require("nandbox-bot-api/src/data/Button");
const Row = require("nandbox-bot-api/src/data/Row");
const Menu = require("nandbox-bot-api/src/data/Menu");
const SetNavigationButtonOutMessage = require("nandbox-bot-api/src/outmessages/SetNavigationButtonOutMessage");


exports.createButton = (
    label,
    callback,
    order,
    bgColor,
    txtColor,
    buttonURL,
    buttonQuery,
    nextMenuRef,
    span
  ) => {
    let btn = new Button();
  
    btn.button_label = label;
    btn.button_order = order;
    btn.button_callback = callback;
    btn.button_bgcolor = bgColor;
    btn.button_textcolor = txtColor;
    btn.button_query = buttonQuery;
    btn.next_menu = nextMenuRef;
    btn.button_url = buttonURL;
    btn.button_span = span | 1;
  
    return btn;
  }


exports.createRow = (buttons,order) =>{
    return new Row(buttons,order);
}

exports.createStartMenu = (rows,menuRef) =>{
    return new Menu(rows,menuRef);
}

exports.setNavigationButton = (chatId, nextMenu, api) =>{
  let fb = new Button();
  fb.next_menu = nextMenu;
  let navMsg = new SetNavigationButtonOutMessage();
  navMsg.chat_id = chatId;
  navMsg.navigation_buttons = []
  navMsg.navigation_buttons.push(fb);

  api.send(JSON.stringify(navMsg));
}

exports.generateRandomNumber = (min,max) =>
{
  return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.numberFromText = (text,numOfDigits) =>
{
  let currentIndex = 4;
  let numAsString = "";
  for(i=0;i<numOfDigits;i++)
  {
    numAsString = numAsString + text[currentIndex];
    currentIndex += 2
  }
  return numAsString
}

exports.getNumberOfMatches= (userString,correctString,size) =>
{
  let result = 0;
  
  for(i=0;i<size;i++)
  {
    let currentChar = userString[i];
    
    if(correctString.includes(currentChar))
    {
      result += 1;
    }
  }
  return result;
}

exports.getNumberOfExactMatches = (userString,correctString,size)=>
{
  let result = 0;
  for(i=0;i<size;i++)
  {
    let currentChar = userString[i];
    if(correctString[i] === currentChar)
    {
      result += 1;
    }
  }
  return result;

}

exports.containsRepetitions = (userString,size) =>
{
  for(i=0;i<userString.length;i++)
  {
    if(userString.indexOf(userString[i]) != userString.lastIndexOf(userString[i]))
    {
      return true;
    }
  }
  return false;
}

exports.containsZeros = (userString) =>
{
  for(i=0;i<userString.length;i++)
  {
    if(userString[i] == '0')
    {
      return true;
    }
  }
  return false;
}

exports.addNewLine = (originalStr,addedStr,beforeLast = false) =>{
  if(beforeLast)
  {
    let lastNewLine = originalStr.lastIndexOf("\n")
    let newStr = `${originalStr.slice(0,lastNewLine+1)}${addedStr}\n${originalStr.slice(lastNewLine+1)}`
    return newStr
  }
  return  `${originalStr}\n${addedStr}`
}

exports.addNewSentence = (originalStr,addedStr,beforeLast = false) =>{
  if(beforeLast)
  {
    let indexOfLastNewline = originalStr.lastIndexOf("\n")
    let newStr = originalStr.slice(0,indexOfLastNewline)+addedStr+originalStr.slice(indexOfLastNewline)
    return newStr
  }
  return `${originalStr}${addedStr}`
}


exports.replaceChar = (str,index,char) =>{
  return `${str.slice(0,index)}${char}${str.slice(index+1)}`
}
