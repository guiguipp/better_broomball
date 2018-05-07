const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

// array of products
var items = [];
var noDes = [];

// mysql connection variable
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "GuiGuiPP18",
    database: "broomball"
    });

// mysql connection func
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    // connection.end();
    });

// function to create each new item as a js object
function Item(category,name,description,provider,price,quantity) {
        this.category = category,
        this.name = name,
        this.description = description,
        this.provider = provider,
        this.price = price,
        this.quantity = quantity
        };

// inquirer prompt to start interacting with the database
inquirer.prompt([
    {
        type: "list",
        message: "Do you want to CHECK the inventory, or UPDATE the inventory?",
        choices: ["VIEW", "UPDATE"],
        name: "action"
    },
    ])
    .then(function(r) {
        // console.log("Choice is ", r.action)
        if (r.action === "VIEW") {
            inquirer.prompt([
                {
                type: "list",
                message: "Admin tools:",
                choices: ["View Products for Sale", "View Low Inventory"],
                name: "check"
                },
            ])
            .then(function(r) {
                // view option#1
                if (r.check === "View Products for Sale") {
                    // console.log("Show Products here");
                    connection.query("SELECT item_id,category,product_name,price,stock_quantity from products", function(err, res) {
                        if (err) throw err;
                        res.forEach(function(e) {
                            noDes.push(e);
                            return noDes;
                            });
                        console.table("\n",noDes);
                        connection.end();
                    })
                }
                // view option#2  list all items with an inventory count lower than five
                else if (r.check === "View Low Inventory") {
                    connection.query("SELECT item_id,category,product_name,price,stock_quantity from products WHERE stock_quantity < 5", function(err, res) {
                        if (err) throw err;
                        let lowInvArray = [];
                        res.forEach(function(e) {
                            lowInvArray.push(e);
                            return lowInvArray;
                            });
                        console.table("\n",lowInvArray);
                        connection.end();
                    }
                )
            }
        })}
        // update
        else if (r.action === "UPDATE") {            
                inquirer.prompt([
                    {
                    type: "list",
                    message: "Admin tools:",
                    choices: ["Add to inventory","Add new product"],
                    name: "update"
                    },
                ])
                .then(function(c) {
                    if (c.update === "Add new product") {
                        inquirer.prompt([
                        {
                            type: "input",
                            message: "Name of new product",
                            name: "name"
                        },
                        {
                            type: "input",
                            message: "Category of new product",
                            name: "category"
                        },
                        {
                            type: "input",
                            message: "Description of new product",
                            name: "description"
                        },
                        {
                            type: "input",
                            message: "Provider of new product",
                            name: "provider"
                        },
                        {
                            type: "input",
                            message: "Price of new product",
                            name: "price"
                        },
                        {
                            type: "input",
                            message: "Stock quantity of new product",
                            name: "quantity"
                        },
                        {
                            type: "confirm",
                            message: "Are you sure you want to save this new product?",
                            name: "confirm",
                            default: false
                        }
                        ])
                        .then(function(r) {
                                // If the inquirerResponse confirms, we create the new object, and enter it in the database
                                if (r.confirm) {
                                    // creating new JS object using constructor
                                    var newProduct = new Item(
                                      r.category,
                                      r.name,
                                      r.description,
                                      r.provider,
                                      r.price,
                                      r.quantity
                                  )                                                                    
                                //   enter product in db using the function
                                newItemInDB(newProduct)
                                }
                                else {
                                  console.log("\nData has not been saved.");
                                  connection.end();
                                }
                              }); 
                        }
                    else if (c.update === "Add to inventory") {
                        console.log("Something fun");
                        connection.end();
                    }
                    });
                };
            });

                    
                    
// function to create each js object into a db entry
function newItemInDB(thing) {
    var query = connection.query(
    "INSERT INTO products SET ?",
    {
        category: thing.category,
        product_name: thing.name,
        description: thing.description,
        provider: thing.provider,
        price: thing.price,
        stock_quantity: thing.quantity
    },
    function(err, res) {
        console.log(res.affectedRows + " product created!\n");
        connection.end();
    }
    )};
