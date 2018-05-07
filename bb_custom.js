const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

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
    });

// getStarted()

function getStarted(){
    console.log("\n***********\nThank you for visiting BBS\n***********\n\n\nHere is our current inventory:");
        viewProducts();
    }



function viewProducts(){
    // querying curated information
    connection.query("SELECT item_id,category,product_name,price from products", function(err, res) {
        if (err) throw err;
        var noDes = [];
        res.forEach(function(e) {
            noDes.push(e);
            return noDes;
            });
        console.table("\n",noDes);
        });
        // re-querying the DB to populate all information
        connection.query("SELECT * from products", function(err, res) {
            if (err) throw err;
            var items = [];
            res.forEach(function(e) {
                items.push(e);
                return items;
                });
            // creating arrays in the local scope to store data from database usable in JS function         
            let itemsId = [];
            let itemsCategory = [];
            let itemsName = [];
            let itemsDescription = [];
            let itemsProvider = [];
            let itemsPrice = [];
            let itemsQuantity = [];
            
            // pushing names and prices to arrays to manipulate
            for (let i = 0; i < items.length; i++) {
                itemsId.push(items[i].item_id);
                itemsCategory.push(items[i].category);
                itemsName.push(items[i].product_name);
                itemsDescription.push(items[i].description);
                itemsProvider.push(items[i].provider);
                itemsPrice.push(items[i].price);
                itemsQuantity.push(items[i].stock_quantity);
            } // pushing all values to separate arrays (with same index)     
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which product would you like to purchase?",
                    choices: itemsName,
                    name: "item"
                },
                {
                    input: "list",
                    message: "How many?",
                    name: "num"
                },
            ]).then(function(res){
                // getting the index of the product chosen in the list (same in all arrays)
                let productIndex = itemsName.indexOf(res.item)
                let currentStock = itemsQuantity[productIndex];
                let currentProd = itemsName[productIndex];
                let currentId = itemsId[productIndex];
                let currentPrice = itemsPrice[productIndex];
                let grandTotal = currentPrice * res.num;

                if (res.num <= currentStock) {
                    inquirer.prompt([
                        {
                        type: "confirm",
                        message: `Are you sure you want to purchase ${res.num} "${currentProd}" for $${currentPrice} each?\nAll sales are final. Please verify the id (${currentId}) and the quantity of the item purchased before submitting your order.`,
                        name: "confirm",
                        default: true
                        }
                        ]).then(function(inquirerResponse) {
                            // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
                            if (inquirerResponse.confirm) {
                                console.log(`\n************\nYour order has been processed. You will receive an invoice for an amount of $${grandTotal}.\nThank you for your business!\n************\n\n\n`);
                                updateDB(currentStock,res.num,currentId)
                            }
                            else {
                                console.log("Order has successfully been cancelled.");
                                
                            }
                        })
                }
                else {
                    console.log("Unfortunately, stock quantity are insufficient at this time to process your order. Please change quantity, or come back later!");
                }
                })
        });
    }


function updateDB(stockQuantity,soldQuantity,id){
    let newQuantity = stockQuantity - soldQuantity;
    // console.log("Stock should now be", newQuantity);
    
    let query = connection.query('UPDATE products SET ? WHERE ?',
    [
      {
        stock_quantity: newQuantity
      },
      {
        item_id: id
      }
    ],
    function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
        // console.log(`There is currently ${currentStock} ${inv.restock} in stock`)
        // Call deleteProduct AFTER the UPDATE completes
        connection.end()
        }
    )
    };



// getStarted();
module.exports.viewProducts = viewProducts;
module.exports.getStarted = getStarted;