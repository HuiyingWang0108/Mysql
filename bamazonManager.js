var inquirer = require('inquirer');
var mysql = require("mysql");
var addArry = [];
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Uarehereforme15!",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
});

inquirer.prompt([
    {
        type: 'list',
        name: 'choiceItem',
        message: 'Which option do you want to choice?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }
]).then(function (answers) {
    if (answers.choiceItem == 'View Products for Sale') {
        connection.query('select * from products', function (err, results) {
            if (err) throw err;
            console.table(results)
        });
    } else if (answers.choiceItem == 'View Low Inventory') {
        connection.query('select * from products where stock_quantity<5', function (err, results) {
            if (err) throw err;
            console.table(results)
        });
    } else if (answers.choiceItem == 'Add to Inventory') {
        var sql = 'select * from products;';
        connection.query(sql, function (err, results) {
            if (err) throw err;
            for (let i = 0; i < results.length; i++) {
                addArry.push((results[i].item_id).toString());
            }
            // console.log(addArry);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'addItem',
                    message: 'Which item do you want to add?',
                    choices: addArry
                },
                {
                    type: 'input',
                    name: 'num',
                    message: 'How many product would you like to add?',
                    validate: function validateNum(num) {
                        var isValid = !isNaN(num);
                        return isValid || "add should be a number!";
                    }
                }
            ]).then(function (answers) {
                var stock_quantity = 0;
                connection.query('select stock_quantity from products where item_id=' + answers.addItem, function (err, results) {
                    if (err) throw err;
                    stock_quantity = results[0].stock_quantity;
                    console.log(stock_quantity);
                    var q = connection.query('update products set stock_quantity=' + (stock_quantity + parseInt(answers.num)) + ' where item_id=' + answers.addItem, function (err, results) {
                        if (err) throw err;
                        // console.table(results);
                    });
                    // console.log(q.sql);
                });

            });
        });

    } else if (answers.choiceItem == 'Add New Product') {
        inquirer.prompt([
            {
                type: 'input',
                name: 'product_name',
                message: 'What is the product name would you like to add?'
            },
            {
                type: 'input',
                name: 'department_name',
                message: 'What is the department name would you like to add?'
            },
            {
                type: 'input',
                name: 'price',
                message: 'How much the price is?',
                validate: function validateNum(price) {
                    var isValid = !isNaN(price);
                    return isValid || "add should be a number!";
                }
            },
            {

                type: 'input',
                name: 'stock_quantity',
                message: 'How many the quantity are?',
                validate: function validateNum(stock_quantity) {
                    var isValid = !isNaN(stock_quantity);
                    return isValid || "add should be a number!";
                }
            }
        ]).then(function (answers) {
            // console.log(typeof answers.product_name);
           var q= connection.query('insert into products (product_name,department_name,price,stock_quantity) VALUES ("' + answers.product_name + '","' + answers.department_name + '",' + answers.price + ',' + answers.stock_quantity + ');', function (err, results) {
                if (err) throw err;
                // console.table(results)
            });
            // console.log(q.sql);
        });

    }
});