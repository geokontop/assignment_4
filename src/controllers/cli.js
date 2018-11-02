/*
 * Cli main file. Called from index.js
 * 
 */

// Dependencies
const responders = require('./responders/responders');
const validators = require('../services/validators');
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
const e = new _events();

// Instantiate the CLI module object
const cli = {};

// Input handlers
e.on('man',(str)=>{
    cli.responders.help();
})

e.on('help',(str)=>{
    cli.responders.help();
})

e.on('exit',(str)=>{
    cli.responders.exit();
})

e.on('stats',(str)=>{
    cli.responders.stats();
})

e.on('menu',(str)=>{
    cli.responders.menu();
})

e.on('pizza',(str)=>{
    cli.responders.pizza(str);
})

e.on('orders',(str)=>{
    cli.responders.orders(str);
})

e.on('order info',(str)=>{
    cli.responders.order(str);
})

e.on('users',(str)=>{
    cli.responders.users(str);
})

e.on('user info',(str)=>{
    cli.responders.user(str);
})

// Responders object
cli.responders = responders;

// Input proccessor
cli.proccessInput = (str)=>{
    str = validators.validateString(str)?str.trim():false;
    if(str){
        // Codify the unique strings that identify the unique questions allowed 
        var uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'menu',
            'pizza',
            'orders',
            'order info',
            'users',
            'user info'
        ]

        // Check if any of the unique strings exist in the cli string. If it is, emit it
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some((input)=>{
            if(str.toLowerCase().indexOf(input)>-1){
                matchFound = true;
                // Emit an event with the matching input and the full string
                e.emit(input, str);
                return true;
            }
        })

        // If no match found, let user know.
        if(!matchFound){
            console.log('No match found, please try again');
        }
    }
}

// Init script
cli.init = ()=>{
    // Send the  start message to the console, in dark blue
    console.log('\x1b[34m%s\x1b[0m',"The cli is running")

    // Create interface
    const _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
      });

    // Create an initial promt
    _interface.prompt();

    // Bind event 
    _interface.on('line',(str)=>{
        // Send to the input processor
        cli.proccessInput(str);

        _interface.prompt();

    })

    // If the user exits the cli, kill the proccess 
    _interface.on('close',()=>{
        process.exit(0);
    });

}



module.exports = cli;