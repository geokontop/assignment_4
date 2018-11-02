/*
 * Cli event responders
 * 
 */

// Dependencies
const validators = require('../../services/validators')
const helpers = require('./helpersCli')
const os = require('os')
const v8 = require('v8')
const _data = require('../../models/data')

// Container
const responders = {};

// ********** Show help info **********
responders.help = ()=>{
    const commands = {
        'man' : 'Show this help page',
        'help' : 'Alias of the "man" commad',
        'exit': 'Exits the CLI and kills the app',
        'stats': 'Get statistics of the underlying operating system and resourse utilization',
        'menu' : 'Show the menu',
        'pizza --{pizzaId}' : 'Show pizza\'s details for the specific id',
        'orders --{hours}' : 'Show recent orders. If the optional flag --{hours} is used, show the orders made the last {hours} hours. If it is not used, show the orders for the last 24 hours',
        'order info --{orderId}' : 'Show details for the specified order',
        'users --{hours}' : 'Show recent users. If the optional flag --{hours} is used, show the users that signed up the last {hours} hours. If it is not used, use 24 hours as default',
        'user info --{email}' : 'Show details of the user with the specified email'
    }

    // Show a header for the help page that is as wide as the screen
    helpers.horizontalLine();
    helpers.centered('CLI MANUAL')
    helpers.horizontalLine();
    helpers.verticalSpace(2);

    // Show each command followed by its explanation, in distinct colors
    for(let key in commands){  
        if(commands.hasOwnProperty(key)){
            let value = commands[key];
            let line = '\x1b[32m' + key + '\x1b[0m' 
            // Evaluate the empty spaces needed for the values to align
            const padding = 25 - key.length;
            // Set the spaces
            for(i=0; i<padding;i++){
                line += ' ';
            }
            // Now set the value
            line += value;
            console.log(line)
        }
        helpers.verticalSpace();
    }
    helpers.horizontalLine();
}

responders.exit = ()=>{
    process.exit(0);
}

// ********** Show system stats **********
responders.stats = ()=>{
    // Compile an object for stats
    const stats = {
        'Load Average' : os.loadavg().join(' '),
        'CPU Count' : os.cpus().length,
        'Free Memory' : os.freemem(),
        'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) *100),
        'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) *100),
        'Uptime' : os.uptime() + ' seconds'
    }
    // Create a header for the stats
    helpers.horizontalLine();
    helpers.centered('STATS')
    helpers.horizontalLine();
    helpers.verticalSpace(2);

    // Print each stat
    for(key in stats){
        if(stats.hasOwnProperty(key)){
            const value = stats[key];
            let line = '\x1b[32m' + key + '\x1b[0m';
            var padding = 35 - key.length;
            for(i=0;i<padding;i++){
                line += ' ';
            }
            line += value;
            console.log(line);
            helpers.verticalSpace();
        }
    }
    helpers.verticalSpace();
    helpers.horizontalLine();
}

// ********** Shows menu **********
responders.menu = ()=>{
    
    // Create a header for the Menu
    helpers.horizontalLine();
    helpers.centered('MENU')
    helpers.horizontalLine();
    helpers.verticalSpace(2);

    // Get the pizzas list
    _data.list('pizzas',(err,pizzaFiles)=>{
        if(!err && pizzaFiles){
            for(let pizzaFile of pizzaFiles){
                console.log(pizzaFile)
                helpers.verticalSpace();
            }
            helpers.horizontalLine()
        }
    })
}

// ********** Show Specific pizza's data **********
responders.pizza = (str)=>{
    
    // Get the pizza Id
    const arr = str.split('--');
    const pizzaId = validators.validateString(arr[1])?arr[1].trim():false;

    if(pizzaId){
        _data.read('pizzas',pizzaId,(err,pizzaData)=>{
            if(!err && pizzaData){
                // Create a header for the pizza
                helpers.horizontalLine();
                helpers.centered('PIZZA '+ pizzaId)
                helpers.horizontalLine();
                helpers.verticalSpace(2);
            
                // Print JSON with colors
                helpers.verticalSpace();
                console.dir(pizzaData,{'colors':true});
                helpers.verticalSpace();

                // Print end line
                helpers.horizontalLine()
            }
        })
    }

}

// ********** Show recent {hours} orders **********
responders.orders = (str)=>{
    
    // Evaluate recent {hours} value
    const arr = str.split('--');
    // Sane or default 24
    const hoursHeader = typeof(Number(arr[1])) == 'number' && Number(arr[1]) % 1 == 0? arr[1] : 24;

    // Create a header for the orders
    helpers.horizontalLine();
    helpers.centered('ORDERS IN LAST '+hoursHeader+' HOURS')
    helpers.horizontalLine();
    helpers.verticalSpace(2);

    // Get the order list
    _data.list('orders',(err,orderFiles)=>{
        // Get all orders
        if(!err && orderFiles){
            for(let orderFile of orderFiles){
                // Split each order name to get the time indentifier
                const orderArr = orderFile.split('_');
                const fileTimestamp = typeof(Number(orderArr[1])) == 'number' && Number(orderArr[1]) % 1 == 0 ? orderArr[1] : false;
                // Show recent files only
                if (fileTimestamp && fileTimestamp > Date.now() - hoursHeader * 60 * 60 * 1000){
                    console.log(orderFile)
                    helpers.verticalSpace();
                }                
            }
            helpers.horizontalLine()
        }
    })
}

// ********** Show Specific order's details **********
responders.order = (str)=>{
    // Get the order id spliting the input string in two parts. Command and parameter
    const arr = str.split('--');
    const orderId = validators.validateString(arr[1])?arr[1].trim():false;

    if(orderId){
        _data.read('orders',orderId,(err,orderData)=>{
            if(!err && orderData){
                // Create a header for the pizza
                helpers.horizontalLine();
                helpers.centered('ORDER '+ orderId)
                helpers.horizontalLine();
                helpers.verticalSpace();
            
                // Print order elements

                // User
                helpers.verticalSpace();
                console.log('Customer:')
                console.log(orderData.customer)
                helpers.verticalSpace();
                // Cart contents
                console.log('Items:')
                orderData.items.cart.forEach((element)=>{
                    console.log('     ',element)
                })
                helpers.verticalSpace(2);
                // Totol value
                console.log('Total:')
                console.log('     ',orderData.items.total)
                helpers.verticalSpace();
                // Print end line
                helpers.horizontalLine()
            }
        })
    }

}

// ********** Show the list of users signed up the last {hours} hours**********
responders.users = (str)=>{
       
    // Evaluate recent {hours} value
    const arr = str.split('--');
    // Sane or default 24
    const hours = typeof(Number(arr[1])) == 'number' && Number(arr[1]) % 1 == 0? arr[1] : 24;

    // Create a header for the users
    helpers.horizontalLine();
    helpers.centered('USERS SIGNED UP IN THE LAST '+hours+' HOURS')
    helpers.horizontalLine();
    helpers.verticalSpace(2);

    // Call function that lists recent files
    _data.listDateCreated('users', hours, (err,newUsers)=>{
        if(!err){
            newUsers.forEach(user=>{
                console.log(user);
                helpers.verticalSpace();
            })
        }   
        // Print end line
        helpers.horizontalLine()     
    })
}

// ********** Show Specific user's details by the email**********
responders.user = (str)=>{
    // Get the  email spliting the input string in two parts. Command and parameter
    const arr = str.split('--');
    const email = validators.validateEmail(arr[1])?arr[1].trim():false;

    if(email){
        _data.read('users',email,(err,userData)=>{
            if(!err && userData){

                // Delete hashed password
                delete userData.hashedPassword

                // Create a header for the specific user
                helpers.horizontalLine();
                helpers.centered('USER '+ email)
                helpers.horizontalLine();
                helpers.verticalSpace();
            
                // Print user details in Json colored
                helpers.verticalSpace();
                console.dir(userData,{'colors':true});
                helpers.verticalSpace();
                
            }
            // Print end line
            helpers.horizontalLine()
        })
    }

}


 module.exports = responders;
