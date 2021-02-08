const Promise = require("bluebird")
const sqlite3 = require('sqlite3').verbose();
const data = require("./data.json")

class dataBase {
    constructor(dbPath){
        this.db = new sqlite3.Database(dbPath,(err) => {
            if(err)
            {
                return console.error(err.message)
            }
            console.log("connected to the database successfully")
        })
    }

    createTable()
    {
        let sql = `CREATE TABLE IF NOT EXISTS ${data.tableName} (
                    chatId varchar(255) NOT NULL,
                    state int NOT NULL,
                    correctNumber varchar(255) NOT NULL,
                    difficulty varchar(255) NOT NULL,
                    maxIndex int NOT NULL,
                    currentTrial int NOT NULL,
                    usedHints int NOT NULL,
                    currentText varchar(255) NOT NULL,
                    name varchar(255) NOT NULL,
                    activeGameRef int NOT NULL,
                    PRIMARY KEY (chatId)
                    );`
        this.db.run(sql,(err)=>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Table has been created successfully`)
        })
    }

    createRecordTable()
    {
        let sql = `CREATE TABLE IF NOT EXISTS ${data.recordTableName} (
                    chatId varchar(255) NOT NULL,
                    name varchar(255) NOT NULL,
                    totalGames int NOT NULL,
                    lowGames int NOT NULL,
                    lowWon int NOT NULL,
                    lowLost int NOT NULL,
                    mediumGames int NOT NULL,
                    mediumWon int NOT NULL,
                    mediumLost int NOT NULL,
                    hardGames int NOT NULL,
                    hardWon int NOT NULL,
                    hardLost int NOT NULL,
                    impossibleGames int NOT NULL,
                    impossibleWon int NOT NULL,
                    impossibleLost int NOT NULL,      
                    PRIMARY KEY (chatId)
                    );`
        this.db.run(sql,(err)=>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Record table has been created successfully`)
        })
    }

    createCurrentlyPlayingTable()
    {
        let sql = `CREATE TABLE IF NOT EXISTS ${data.currentlyPlayingTableName} (
            chatId varchar(255) NOT NULL,    
            PRIMARY KEY (chatId)
            );`
            this.db.run(sql,(err)=>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Currently playing table has been created successfully`)
        })
    }

    addCurrentlyPlaying(chatId)
    {
        let sql = `insert into ${data.currentlyPlayingTableName} values ("${chatId}")`
        this.db.run(sql,(err)=>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`${chatId} is currently playing`)
        })
    }

    isCurrentlyPlaying(chatId)
    {
        let sql = `select * from ${data.currentlyPlayingTableName} where ${data.currentlyPlayingTableColumns.chatId} = "${chatId}"`
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,result)=>{
                if(err)
                {
                    reject(err.message)
                }
                if(result.length > 0)
                {
                    resolve(true)
                }
                else
                {
                    resolve(false)
                }
                
            })
        })
    }

    removeCurrentlyPlaying(chatId)
    {
        let sql = `delete from ${data.currentlyPlayingTableName} where ${data.currentlyPlayingTableColumns.chatId} = "${chatId}"`
        this.db.run(sql,(err)=>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`${chatId} has finished his game`)
        })
    }

    chatExists(chatId)
    {
        let sql = `select count(1) from ${data.recordTableName} where ${data.recordTableColumns.chatId} = "${chatId}"`
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,result)=>{
                if(err)
                {
                    reject(err.message)
                }
                
                resolve(result[0])
            })
        })

    }

    addInitialRecord(chatId,name)
    {
        this.chatExists(chatId).then((res) => {
            console.log(Object.values(res)[0])
            
                if(Object.values(res)[0] == 0)
                {
                    let sql = `insert into ${data.recordTableName} values ("${chatId}","${name}",0,0,0,0,0,0,0,0,0,0,0,0,0)`
                    this.db.run(sql,(err)=>{
                        if(err)
                        {
                            return console.log(err.message)
                        }
                        console.log(`initial values for ${chatId} have been inserted successfully`)
                    })
                }
                else
                {
                    console.log("chat already exists")
                }
            
        })
        
    }

    modifyRecord(chatId,gameType,gameWon)
    {
        this.getRecord(chatId,gameType).then((res) =>{
            let recordValues = []
            for(const key in res)
            {
                recordValues.push(res[key]);
            }

            recordValues[0] += 1
            recordValues[1] += 1
            if(gameWon)
            {
                recordValues[2] += 1
            }
            else
            {
                recordValues[3] += 1
            }


            let col1 = ""
            let col2 = ""
            let col3 = ""
            if(gameType == 'low')
            {
                col1 = data.recordTableColumns.lowGames
                col2 = data.recordTableColumns.lowWon
                col3 = data.recordTableColumns.lowLost
            }
            else if(gameType == 'medium')
            {
                col1 = data.recordTableColumns.mediumGames
                col2 = data.recordTableColumns.mediumWon
                col3 = data.recordTableColumns.mediumLost
            }
            else if(gameType == 'hard')
            {
                col1 = data.recordTableColumns.hardGames
                col2 = data.recordTableColumns.hardWon
                col3 = data.recordTableColumns.hardLost
            }
            else if(gameType == 'impossible')
            {
                col1 = data.recordTableColumns.impossibleGames
                col2 = data.recordTableColumns.impossibleWon
                col3 = data.recordTableColumns.impossibleLost
            }

            let updateStatement = `${data.recordTableColumns.totalGames} = "${recordValues[0]}",${col1} = "${recordValues[1]}",${col2} = "${recordValues[2]}",${col3} = "${recordValues[3]}"`

            let sql = `UPDATE ${data.recordTableName} SET ${updateStatement} WHERE ${data.recordTableColumns.chatId}=${chatId}`;
            this.db.run(sql,(err)=>{
                if(err)
                {
                    return console.log(err.message)
                }
                console.log(`updated records for chat ${chatId}`)
            })
            
        })
    }

    getRecord(chatId,gameType)
    {
        let col1 = ""
        let col2 = ""
        let col3 = ""
        if(gameType == 'low')
        {
            col1 = data.recordTableColumns.lowGames
            col2 = data.recordTableColumns.lowWon
            col3 = data.recordTableColumns.lowLost
        }
        else if(gameType == 'medium')
        {
            col1 = data.recordTableColumns.mediumGames
            col2 = data.recordTableColumns.mediumWon
            col3 = data.recordTableColumns.mediumLost
        }
        else if(gameType == 'hard')
        {
            col1 = data.recordTableColumns.hardGames
            col2 = data.recordTableColumns.hardWon
            col3 = data.recordTableColumns.hardLost
        }
        else if(gameType == 'impossible')
        {
            col1 = data.recordTableColumns.impossibleGames
            col2 = data.recordTableColumns.impossibleWon
            col3 = data.recordTableColumns.impossibleLost
        }
        let sql = `SELECT ${data.recordTableColumns.totalGames},${col1},${col2},${col3} FROM ${data.recordTableName} WHERE ${data.recordTableColumns.chatId}="${chatId}"`
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                
                resolve(rows[0])
            })
        })
    }

    getAllRecords(chatId)
    {
        let sql = `SELECT * FROM ${data.recordTableName} WHERE ${data.recordTableColumns.chatId}="${chatId}"`
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                
                resolve(rows[0])
            })
        })

    }

    getTopLowRecords()
    {
        let sql = `select ${data.recordTableColumns.name},${data.recordTableColumns.lowWon} from ${data.recordTableName} ORDER by (${data.recordTableColumns.lowWon}) DESC LIMIT 5`
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                
                resolve(rows)
            })
        })
    }

    getTopMediumRecords()
    {
        let sql = `select ${data.recordTableColumns.name},${data.recordTableColumns.mediumWon} from ${data.recordTableName} ORDER by (${data.recordTableColumns.mediumWon}) DESC LIMIT 5`
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                
                resolve(rows)
            })
        })
    }

    getTopHardRecords()
    {
        let sql = `select ${data.recordTableColumns.name},${data.recordTableColumns.hardWon} from ${data.recordTableName} ORDER by (${data.recordTableColumns.hardWon}) DESC LIMIT 5`
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                
                resolve(rows)
            })
        })
    }

    getTopImpossibleRecords()
    {
        let sql = `select ${data.recordTableColumns.name},${data.recordTableColumns.impossibleWon} from ${data.recordTableName} ORDER by (${data.recordTableColumns.impossibleWon}) DESC LIMIT 5`
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                
                resolve(rows)
            })
        })
    }



//EXTRA FUNCTIONS THAT COULD BE USED LATER

    addValues(chatId,state,correctNumber,difficulty,maxIndex,currentTrial,usedHints,currentText,name,activeGameRef)
    {
        let tableNames = "("
        let values = []
        if(chatId != null)
        {
            values.push(chatId)
            tableNames += "chatId,"
        }
        if(state != null)
        {
            values.push(state)
            tableNames += "state,"
        }
        if(correctNumber != null)
        {
            values.push(correctNumber)
            tableNames += "correctNumber,"
        }
        if(difficulty != null)
        {
            values.push(difficulty)
            tableNames += "difficulty,"
        }
        if(maxIndex != null)
        {
            values.push(maxIndex)
            tableNames += "maxIndex,"
        }
        if(currentTrial != null)
        {
            values.push(currentTrial)
            tableNames += "currentTrial,"
        }
        if(usedHints != null)
        {
            values.push(usedHints)
            tableNames += "usedHints,"
        }
        if(currentText != null)
        {
            values.push(currentText)
            tableNames += "currentText,"
        }
        if(name != null)
        {
            values.push(name)
            tableNames += "name,"
        }
        if(activeGameRef != null)
        {
            values.push(activeGameRef)
            tableNames += "activeGameRef,"
        }
        tableNames = tableNames.slice(0,tableNames.length-1)+")"

        
        let placeholders = values.map((value) => '(?)').join(',');
        let sql = `INSERT INTO ${data.tableName}${tableNames} VALUES (${placeholders})`;

        this.db.run(sql,values,(err) =>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`values ${values} have been inserted successfully`)
        })
    }


    modifyValues(chatId,state,correctNumber,difficulty,maxIndex,currentTrial,usedHints,currentText,name,activeGameRef)
    {
        let updateStatement = ""
        if(state != null)
        {
            updateStatement += `state = "${state}",`
        }
        if(correctNumber != null)
        {
            updateStatement += `correctNumber = "${correctNumber}",`
        }
        if(difficulty != null)
        {
            updateStatement += `difficulty = "${difficulty}",`
        }
        if(maxIndex != null)
        {
            updateStatement += `maxIndex = "${maxIndex}",`
        }
        if(currentTrial != null)
        {
            updateStatement += `currentTrial = "${currentTrial}",`
        }
        if(usedHints != null)
        {
            updateStatement += `usedHints= "${usedHints}",`
        }
        if(currentText != null)
        {
            updateStatement += `currentText = "${currentText}",`
        }
        if(name != null)
        {
            updateStatement += `name = "${name}",`
        }
        if(activeGameRef != null)
        {
            updateStatement += `activeGameRef= "${activeGameRef}",`
        }
        updateStatement = updateStatement.slice(0,updateStatement.length-1);

        let sql = `UPDATE ${data.tableName} SET ${updateStatement} WHERE chatId = "${chatId}"`
        this.db.run(sql,(err) =>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`values have been inserted successfully`)
        })
    }


}

module.exports = dataBase;