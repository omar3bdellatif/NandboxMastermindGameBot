const MenuActions = require("./menuItemsActions");

exports.startMenuItems = {
    items:{
        item1:"🎮 New Game",
        item2:"📚 GameRules",
        item3:"📈 Game stats",
        item4:"🏆 Challenge stats",
        item5:"ℹ️ Info",
        item6:"✉️ Invite friend"
    },
    callBacks:{
        item1:"newGame",
        item2:"gameRules",
        item3:"gameStats",
        item4:"challengeStats",
        item5:"info",
        item6:"inviteFriend"

    },
    actions:{
        item1:MenuActions.newGame,
        item2:MenuActions.gameRules,
        item3:MenuActions.getRecord,
        item4:MenuActions.getTopRecords,
        item5:MenuActions.info,
        item6:MenuActions.inviteFriend
    },
    state:{
        item1:1,
        item2:0,
        item3:0,
        item4:0,
        item5:0,
        item6:0
    },
    reference:"startMenu"
    
}

exports.newGameMenuItems = {
    items:{
        item1: "⚪ LOW",
        item2: "🔵 MEDIUM",
        item3: "🔴 HARD",
        item4: "⚫ IMPOSSIBLE",
        item5:"🔙 Back"
    },
    callBacks:{
        item1: "low",
        item2: "medium",
        item3: "hard",
        item4: "impossible",
        item5:"back"

    },
    actions:{
        item1:MenuActions.startGame,
        item2:MenuActions.startGame,
        item3:MenuActions.startGame,
        item4:MenuActions.startGame,
        item5:MenuActions.start
    },
    state:{
        item1:2,
        item2:2,
        item3:2,
        item4:2,
        item5:0,

    },
    reference:"newGameMenu"
}

exports.keypadMenuItems = {
    items:{
        item1: "1",
        item2: "2",
        item3: "3",
        item4: "4",
        item5:"5",
        item6:"6",
        item7: "7",
        item8: "8",
        item9: "9",
        item10: "Delete",
        item11: "0",
        item12: "Enter",
        item13: "🔍 Use Hint"
    },
    callBacks:{
        item1: "1",
        item2: "2",
        item3: "3",
        item4: "4",
        item5:"5",
        item6:"6",
        item7: "7",
        item8: "8",
        item9: "9",
        item10: "delete",
        item11: "0",
        item12: "enter",
        item13: "useHint"

    },
    actions:{
        item1: MenuActions.keypadNumber,
        item2: MenuActions.keypadNumber,
        item3: MenuActions.keypadNumber,
        item4: MenuActions.keypadNumber,
        item5: MenuActions.keypadNumber,
        item6: MenuActions.keypadNumber,
        item7: MenuActions.keypadNumber,
        item8: MenuActions.keypadNumber,
        item9: MenuActions.keypadNumber,
        item10: MenuActions.keypadDelete,
        item11: MenuActions.keypadNumber,
        item12: MenuActions.keypadEnter,
        item13: MenuActions.hint
    },
    state:{
        item1: 2,
        item2: 2,
        item3: 2,
        item4: 2,
        item5: 2,
        item6: 2,
        item7: 2,
        item8: 2,
        item9: 2,
        item10: 2,
        item11: 2,
        item12: 2,
        item13: 3

    },
    currentIndex:0,
    reference:"keypadMenu"
}

exports.gameMenuItems = {
    items:{
        item1: "📖 Game Rules",
        //item2: "🔍 Use Hint",
        item3: "🏁 Solve Game",
    },
    callBacks:{
        item1: "gameRules",
        //item2: "useHint",
        item3: "solveGame",

    },
    actions:{
        item1:MenuActions.gameRules,
        //item2:MenuActions.start,
        item3:MenuActions.solve
    },
    state:{
        item1: 2,
        //item2: 0,
        item3: 0
    },
    reference:"gameMenu"
}