const inquirer = require("inquirer");
require("dotenv").config();
const keys = {login: process.env.ADMIN_LOGIN,password: process.env.ADMIN_PASSWORD}

userType()

// Checks if you are a user or an admin of the Store
function userType(){
    inquirer.prompt([
        {
          type: "list",
          message: "\nWelcome to Better Broomball Store!\n",
          choices: ["Browse the store", "Admin access"],
          name: "type"
        }
      ])
      .then(function(res) {
        // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
        if (res.type === "Browse the store") {
          console.log("Go to the Store");
          
        }
        else if (res.type === "Admin access") {
            login();
        }
      });
    
    
}

// Checks admin credentials. If valid, enables admin options
function login(){
    inquirer.prompt([
        {
        type: "input",
        message: "Login",
        name: "username"
        },
        {
        type: "password",
        message: "Password",
        name: "password"
        }
    ]).then(function(res) {
        // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
        if (res.username === keys.login && res.password === keys.password) {
            console.log("\nWelcome ",res.username,"\n");
            let manager = require("./bb_manager.js");
            }
        else {
            console.log("\nInvalid credentials. Please try again later.\n");
            }
        });
    }