// Defined variables and requirements
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "_EF10508315_",
        database: "management_db"
    }, 
    console.log("Connection to management_db Successful.")
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// First prompt the user with an array of questions to get started
const promptUser = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Which action would you like to take? ",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit"
            ]
        }
    ])
    .then((data) => {
        switch (data.menu) {
            case "View all departments":
                viewAllDepartments();
                break;

            case "View all roles":
                viewAllRoles();
                break;
            
            case "View all employees":
                viewAllEmployees();
                break;

            case "Add a Department":
                addDepartment();
                break;

            case "Add a role":
                addRole();
                break;

            case "Add an employee":
                addEmployee();
                break;
            
            case "Update an employee role":
                updateEmployee();
                break;

            case "Exit":
                exitApp();
                break;
        }
    })
}