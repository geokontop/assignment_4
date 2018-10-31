/*
 * Primary file for API
 *
 */

 // Dependencies
 const server = require('./src/server');
 const workers = require('./src/services/workers');

// App container
const app = {};

// Init function
app.init = ()=>{
    // Start servers
    server.init();

    // Start the workers
    workers.init();

}

// Execute
app.init();

// Export app
module.exports = app;



