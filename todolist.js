//requires
const prompt = require("prompt-sync")()
const fs = require('fs');

//variables
let consoleColorCodes = {
    'red': '\x1b[31m%s\x1b[0m',
    'green': '\x1b[32m%s\x1b[0m',
    'yellow': '\x1b[33m%s\x1b[0m',
    'cyan': '\x1b[36m%s\x1b[0m',
    'blue': '\x1b[34m%s\x1b[0m',
    'pink': '\x1b[35m%s\x1b[0m',
}
let terminated = false;
let databaseFile = require('./db.json')

const DEFAULT_DATA = {
    entries : {"toDo": []}
}

async function SaveFile(dataToSave) {
    fs.writeFileSync('./db.json', JSON.stringify(dataToSave))
}

if (!databaseFile.entries.toDo){
    databaseFile = DEFAULT_DATA
    SaveFile(databaseFile)
}

if (!databaseFile){
    databaseFile = require("./db.json")
    databaseFile = DEFAULT_DATA
    SaveFile(databaseFile)
}

const commandFunctions = {
'viewlist' : callToDo,

'create' : async function Create(){
    let givenTask = prompt(`What would you like to add to your to do list : `)

if (givenTask != " " && givenTask != ""){

    toDo = [];
    if (!databaseFile.entries.toDo) {
        databaseFile.entries.toDo = []
    }

    databaseFile.entries.toDo.push({
        task: givenTask,
    })
    
    SaveFile(databaseFile)

    console.log(consoleColorCodes.blue, `Added entry!`)
    callToDo()
    }

    else {
        console.log(consoleColorCodes.red, `Please do not use spaces as a task.`)
    }
},
        
'finish' : async function Finish(){
    if ((databaseFile.entries.toDo).length != 0){
    callToDo()
    console.log(consoleColorCodes.yellow, `Which serial number do you want to remove : `)
    const userRemove = parseInt(prompt(''))

    if (!databaseFile.entries.toDo[userRemove]) {
        console.log(consoleColorCodes.red, 'Serial number does not exist!')
    }
    else {
        (databaseFile.entries.toDo).splice(userRemove, 1)
        SaveFile(databaseFile)

        console.log(consoleColorCodes.red, `Removed task.`)

        if (databaseFile.entries.toDo == 0){
            console.log(consoleColorCodes.green, `To-do list is now empty. Add something using the 'create' command!`)
        }
        else {
            callToDo()
        }
    }
}
else {
    console.log(consoleColorCodes.red, `There are no tasks in the to-do list. Add something using the 'create' command!`)
    }
},

'edit' : async function Edit(){
    if ((databaseFile.entries.toDo).length != 0){
        callToDo()
        console.log(consoleColorCodes.yellow, `Which serial number do you want to edit : `)
        const userEdit = parseInt(prompt(''))

        if (!databaseFile.entries.toDo[userEdit]) {
            console.log(consoleColorCodes.red, `That serial number does not exist!`)
        }

        else {
            const editedTask = prompt(`What would you like to edit this task to : `)

            if (editedTask != " " && editedTask != ""){
                databaseFile.entries.toDo[userEdit] = {task: `${editedTask}`}

                SaveFile(databaseFile)
                console.log(consoleColorCodes.red, `Task edited!`)
                callToDo()
            }

            else {
                console.log(consoleColorCodes.red, `Please do not use spaces for an edited task!`)
            }
        }
    }
    
    else {
        console.log(consoleColorCodes.red, `To-do list is currently empty. Add something to it using the 'create' command!`)
    }
},

'wipe data' : async function wipeData(){

    if ((databaseFile.entries.toDo).length != 0){
        console.log(consoleColorCodes.red, `Are you sure you want to wipe your data? Y/N : `)
        let wipeChoice = (prompt('').toLowerCase()).trim()

        switch (wipeChoice){
            case "y":
            case "yes":
            databaseFile = DEFAULT_DATA
            SaveFile(databaseFile)
            
            console.log(consoleColorCodes.red, `Succesfully wiped all data. `)
            console.log(consoleColorCodes.cyan, `Arrivederici.`)
            terminated = true;
            break;

            case "n":
            case "no":
            console.log(consoleColorCodes.red, `Data was not wiped.`)
            break;

            default:
            console.log(consoleColorCodes.red, `Please only pick Y or N.`)
            break;
        }
    }
    else {
        console.log(consoleColorCodes.red, `There is no data to wipe, please create a task using the 'create' command.`)
    }
},

'end' : async function End(){
    console.log(consoleColorCodes.red, `Arrivederici.`)
    terminated = true
},

'help' : async function Help(){ 
console.log(consoleColorCodes.pink, `help\ncreate\nfinish\nedit\nviewlist\nwipedata\nend`)
    }

}


async function callToDo(){
    if ((databaseFile.entries.toDo).length == 0){
     console.log(consoleColorCodes.red, `To-do list is currently empty. Please create a task using the 'create' command.`)
    }
 
    else {
     console.log(consoleColorCodes.red, `Here is your to do list! : `)
 
    for (let i = 0; i < (databaseFile.entries.toDo).length; i++){
     console.log (consoleColorCodes.green, `${i}) ${(databaseFile.entries.toDo)[i].task}`)
         }
     }
}


function main(){
    while (!terminated){
    const userOption = prompt(`Please enter a command : `)
    if (!commandFunctions[userOption]) {
        console.log(consoleColorCodes.red, 'Command does not exist, please type "help" to see all available commands.')
    }
    
    else {
    commandFunctions[userOption]()
    }

    }
}

//Starting the commands
console.clear()
main()
