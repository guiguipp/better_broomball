var mysql = require("mysql");

// mysql connection variable
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "GuiGuiPP18",
    database: "market_place"
    });

// mysql connection func
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // connection.end();
    });

// function to create each new item as a js object
function Item(name,category,product_name,description,provider,price,stock_quantity) {
        this.name = name,
        this.category = category,
        this.product_name = product_name,
        this.description = description,
        this.provider = provider,
        this.price = price,
        this.stock_quantity = stock_quantity
        };
    
// function to create each js object into a db tuple
function newItemInDB(thing) {
    var query = connection.query(
    "INSERT INTO auctions SET ?",
    {
        item_name: thing.name,
        category: thing.category,
        product_name: thing.product_name,
        description: thing.description, 
        provider: thing.provider,
        price: thing.price,
        stock_quantity: thing.stock_quantity
    },
    function(err, res) {
        console.log(res.affectedRows + " object created!\n");
        connection.end();
    }
    )};
    