/*
 * Primary file for API
 *
 */

 // Dependencies
 const server = require('./src/server');
 const workers = require('./src/services/workers');
 const cli = require('./src/controllers/cli');

// App container
const app = {};

// Init function
app.init = ()=>{
    // Start servers
    server.init();

    // Start the workers
    workers.init();

    // Start the cli after a 50 msec delay
    setTimeout(() => {
        cli.init();
    }, 50);
}

// Execute
app.init();

// Export app
module.exports = app;



