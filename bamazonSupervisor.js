
var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Why0108",
    database: "bamazon"
});

inquirer.prompt([
    {
        type: 'list',
        name: 'choiceItem',
        message: 'Which option do you want to choice?',
        choices: ['View Product Sales by Department', 'Create New Department']
    }
]).then(function (answers) {
    if (answers.choiceItem == 'View Product Sales by Department') {
        connection.query('select d.*,product_sales,(product_sales-d.over_head_costs) as total_profit from departments d left join (SELECT sum(product_sales) as product_sales,department_name FROM products group by department_name) p on d.department_name=p.department_name;', function (err, results) {
            if (err) throw err;
            console.table(results)
        });
    }else if(answers.choiceItem =='Create New Department'){
        inquirer.prompt([
            {
                type: 'input',
                name: 'department_name',
                message: 'What is the department name would you like to add?'
            },
            {
                type: 'input',
                name: 'over_head_costs',
                message: 'What is the over_head_costs would you like to add?',
                validate: function validateNum(over_head_costs) {
                    var isValid = !isNaN(over_head_costs);
                    return isValid || "add should be a number!";
                }
            }
        ]).then(function (answers) {
            // console.log(typeof answers.department_name);
           var q= connection.query('insert into departments (department_name,over_head_costs) VALUES ("' + answers.department_name + '",' + answers.over_head_costs+');', function (err, results) {
                if (err) throw err;
                // console.table(results)
            });
            console.log(q.sql);
        });
    }
});