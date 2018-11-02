/*
 * Helper functions for the cli appearence
 * 
 */

 // Dependencies
 const validators = require('../../services/validators')

// Container
const helpers = {};

helpers.horizontalLine = ()=>{
    const width = process.stdout.columns;
    let line = '';
    for(i=0;i<width;i++){
        line += '-'
    }
    console.log(line);
}

helpers.verticalSpace = (lines)=>{
    lines = typeof(lines) == Number && lines > 0 ? lines: 1;
    for(i=0; i<lines; i++){
        console.log('')
    }
}

helpers.centered = (str)=>{
    // Sanity check
    str = validators.validateString(str)? str.trim(): "";

    // Get the screen width
    width = process.stdout.columns;

    // Calculate the left padding
    const leftPadding = Math.floor((width - str.length)/2);

    // Form the line
    let line = '';
    // Print spaces for left margin
    for(i=0;i<leftPadding;i++){
        line += ' ';
    }
    // Print the string
    line += str

    // Show
    console.log (line)
}

module.exports = helpers;