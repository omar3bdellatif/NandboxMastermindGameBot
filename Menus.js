const Menu = require("nandbox-bot-api/src/data/Menu");
const Row = require("nandbox-bot-api/src/data/Row");
const data = require("./data.json")
const funcs = require("./funcs");
const MenuItems = require("./MenuItems");

//Start Menu

let row1ButtonsStartMenu = [
   
    funcs.createButton(MenuItems.startMenuItems.items.item1,MenuItems.startMenuItems.callBacks.item1,1,"lightgrey","black",null,null,null,1),
    funcs.createButton(MenuItems.startMenuItems.items.item2,MenuItems.startMenuItems.callBacks.item2,2,"lightgrey","black",null,null,null,1)
]
let row2ButtonsStartMenu = [
    funcs.createButton(MenuItems.startMenuItems.items.item3,MenuItems.startMenuItems.callBacks.item3,1,"lightgrey","black",null,null,null,1),
    funcs.createButton(MenuItems.startMenuItems.items.item4,MenuItems.startMenuItems.callBacks.item4,2,"lightgrey","black",null,null,null,1)
]
let row3ButtonsStartMenu = [
    funcs.createButton(MenuItems.startMenuItems.items.item5,MenuItems.startMenuItems.callBacks.item5,1,"lightgrey","black",null,null,null,1),
    funcs.createButton(MenuItems.startMenuItems.items.item6,MenuItems.startMenuItems.callBacks.item6,2,"#lightgrey","black",null,null,null,1)
]
/*let row4ButtonsStartMenu = [
    funcs.createButton(MenuItems.startMenuItems.items.item7,MenuItems.startMenuItems.callBacks.item7,1,"lightgrey","black",null,null,null,1),
    funcs.createButton(MenuItems.startMenuItems.items.item8,MenuItems.startMenuItems.callBacks.item8,2,"lightgrey","black",null,null,null,1)
]*/

let rowsStartMenu = [new Row(row1ButtonsStartMenu,1),new Row(row2ButtonsStartMenu,2),new Row(row3ButtonsStartMenu,3)]
exports.startMenu = [new Menu(rowsStartMenu,'startMenu')]

/*****************************************************************************************/

//New Game Menu

let row1ButtonsNewGameMenu = [
    funcs.createButton(MenuItems.newGameMenuItems.items.item1,MenuItems.newGameMenuItems.callBacks.item1,1,"lightgrey","black",null,null,null,1),
    funcs.createButton(MenuItems.newGameMenuItems.items.item2,MenuItems.newGameMenuItems.callBacks.item2,2,"lightgrey","black",null,null,null,1)
]
let row2ButtonsNewGameMenu = [
    funcs.createButton(MenuItems.newGameMenuItems.items.item3,MenuItems.newGameMenuItems.callBacks.item3,1,"lightgrey","black",null,null,null,1),
    funcs.createButton(MenuItems.newGameMenuItems.items.item4,MenuItems.newGameMenuItems.callBacks.item4,2,"lightgrey","black",null,null,null,1)
]
let row3ButtonsNewGameMenu = [
    funcs.createButton(MenuItems.newGameMenuItems.items.item5,MenuItems.newGameMenuItems.callBacks.item5,1,"lightgrey","black",null,null,null,1),
]

let rowsNewGameMenu = [new Row(row1ButtonsNewGameMenu,1),new Row(row2ButtonsNewGameMenu,2),new Row(row3ButtonsNewGameMenu,3)]
exports.newGameMenu = [new Menu(rowsNewGameMenu,'newGameMenu')]

/*****************************************************************************************/

//Inline key pad menu

let row1ButtonskeypadMenu = [
    funcs.createButton(MenuItems.keypadMenuItems.items.item1,MenuItems.keypadMenuItems.callBacks.item1,1,"lightgrey","white",null,null,null,1),
    funcs.createButton(MenuItems.keypadMenuItems.items.item2,MenuItems.keypadMenuItems.callBacks.item2,2,"lightgrey","white",null,null,null,1),
    funcs.createButton(MenuItems.keypadMenuItems.items.item3,MenuItems.keypadMenuItems.callBacks.item3,3,"lightgrey","white",null,null,null,1)
]
let row2ButtonskeypadMenu = [
    funcs.createButton(MenuItems.keypadMenuItems.items.item4,MenuItems.keypadMenuItems.callBacks.item4,1,"lightgrey","white",null,null,null,1),
    funcs.createButton(MenuItems.keypadMenuItems.items.item5,MenuItems.keypadMenuItems.callBacks.item5,2,"lightgrey","white",null,null,null,1),
    funcs.createButton(MenuItems.keypadMenuItems.items.item6,MenuItems.keypadMenuItems.callBacks.item6,3,"lightgrey","white",null,null,null,1)
]
let row3ButtonskeypadMenu = [
    funcs.createButton(MenuItems.keypadMenuItems.items.item7,MenuItems.keypadMenuItems.callBacks.item7,1,"lightgrey","white",null,null,null,1),
    funcs.createButton(MenuItems.keypadMenuItems.items.item8,MenuItems.keypadMenuItems.callBacks.item8,2,"lightgrey","white",null,null,null,1),
    funcs.createButton(MenuItems.keypadMenuItems.items.item9,MenuItems.keypadMenuItems.callBacks.item9,3,"lightgrey","white",null,null,null,1)
]
let row4ButtonskeypadMenu = [
    funcs.createButton(MenuItems.keypadMenuItems.items.item10,MenuItems.keypadMenuItems.callBacks.item10,1,"lightgrey","white",null,null,null,1),
    funcs.createButton(MenuItems.keypadMenuItems.items.item11,MenuItems.keypadMenuItems.callBacks.item11,2,"lightgrey","white",null,null,null,1),
    funcs.createButton(MenuItems.keypadMenuItems.items.item12,MenuItems.keypadMenuItems.callBacks.item12,3,"lightgrey","white",null,null,null,1)
]
let row5ButtonskeypadMenu = [
    funcs.createButton(MenuItems.keypadMenuItems.items.item13,MenuItems.keypadMenuItems.callBacks.item13,1,"lightgrey","white",null,null,null,1)
]


let rowsKeypadMenu = []
if(data.maxHints == 0)
{
    rowsKeypadMenu = [new Row(row1ButtonskeypadMenu,1),new Row(row2ButtonskeypadMenu,2),new Row(row3ButtonskeypadMenu,3),new Row(row4ButtonskeypadMenu,4)]

}
else
{
    rowsKeypadMenu = [new Row(row1ButtonskeypadMenu,1),new Row(row2ButtonskeypadMenu,2),new Row(row3ButtonskeypadMenu,3),new Row(row4ButtonskeypadMenu,4),new Row(row5ButtonskeypadMenu,5)]

}
exports.keypadMenu = [new Menu(rowsKeypadMenu,MenuItems.keypadMenuItems.reference)]

/****************************************************************************************/

//Game Menu
let row1ButtonsGameMenu = [
    funcs.createButton(MenuItems.gameMenuItems.items.item1,MenuItems.gameMenuItems.callBacks.item1,1,"lightgrey","white",null,null,null,1)
]
/*let row2ButtonsGameMenu = [
    funcs.createButton(MenuItems.gameMenuItems.items.item2,MenuItems.gameMenuItems.callBacks.item2,1,"lightgrey","white",null,null,null,1)
]*/
let row2ButtonsGameMenu = [
    funcs.createButton(MenuItems.gameMenuItems.items.item3,MenuItems.gameMenuItems.callBacks.item3,1,"lightgrey","white",null,null,null,1)
]

let rowsGameMenu = [new Row(row1ButtonsGameMenu,1),new Row(row2ButtonsGameMenu,2)]
exports.gameMenu = [new Menu(rowsGameMenu,MenuItems.gameMenuItems.reference)]
/****************************************************************************************/