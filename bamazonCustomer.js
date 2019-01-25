
var mysql = require("mysql");
var inquirer = require('inquirer');
var choiceArry = [];

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Why0108",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    //   console.log("connected as id " + connection.threadId);
    //   var sql='INSERT INTO book set ?;',{
    //     title:"MyTitle",
    //     artist:"ddd"
    //   };
    var sql = 'select * from products;';
    var q = connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        for (let i = 0; i < results.length; i++) {
            choiceArry.push((results[i].item_id).toString());
        }
        // console.log(choiceArry);

        console.table(results);
        // console.dir(results);
        inquirer.prompt([
            {
                type: 'list',
                name: 'choiceItem',
                message: 'What the ID of the product would you like to buy?',
                choices: choiceArry
            },
            {
                type: 'input',
                name: 'num',
                message: 'How many units of the product would you like to buy?',
                // validate: function validateNum(value) {
                //     if (isNaN(value) === false) {
                //         return true;
                //     }
                //     return false;
                // }
                validate: function validateNum(num) {
                    var isValid = !isNaN(num);
                    return isValid || "Age should be a number!";
                }
            }

        ]).then(function (answers) {
            var sql = 'select * from products where item_id=' + answers.choiceItem;
            connection.query(sql, function (err, results) {
                if (err) throw err;
                // console.log(results[0]);
                if (parseInt(answers.num) > results[0].stock_quantity) {
                    console.log("Insufficient quantity!");
                } else {
                    console.log(results[0].stock_quantity - parseInt(answers.num));
                    var updateSql = 'update products set stock_quantity=' + (results[0].stock_quantity - parseInt(answers.num)) + ' where item_id=' + answers.choiceItem;
                    var u=connection.query(updateSql);
                    console.log(results[0].price * parseInt(answers.num));
                    var sales=results[0].price * parseInt(answers.num);
                    //ALTER TABLE products ADD COLUMN product_sales float(10,2) AFTER stock_quantity;
                    console.log("product_sales",parseFloat(results[0].product_sales)||0);
                    var new_sales=parseFloat(results[0].product_sales)||0;
                    var n=connection.query('update products set product_sales='+(sales+new_sales)+' where item_id=' + answers.choiceItem,function(err,results){
                        if (err) throw err;
                    });
                    
                    // console.log(n.sql);
                }
            });

            // console.log(answers.choiceItem);
            // console.log(typeof (answers.num));
            // console.log(typeof results[0].stock_quantity);

        });


        // console.log(fields);
    });
    //   console.log(q.sql);
    //   connection.end();
});
// connection.query('select * from products',function(err,results){
//     if(err) throw err;
//     console.table(results)
// });
