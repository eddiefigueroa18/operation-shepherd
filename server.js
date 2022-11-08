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
//Once user has selected, run the function for the selected option
const promptUserMenu = () => {
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

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// VIEW SECTION
// VIEW ALL DEPARTMENTS
const viewAllDepartments = () => {
    connection.query("SELECT * FROM department", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
}

//VIEW ALL ROLES
const viewAllRoles = () => {
    connection.query("SELECT * FROM roles", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
}

// VIEW ALL EMPLOYEES 
const viewAllEmployees = () => {
    connection.query("SELECT * FROM employees", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// ADDING SECTION
// ADD A DEPARTMENT
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "newDepName",
            message: "What is the name of the new department? "
        }
    ])
    .then((data) => {
        connection.query("INSERT INTO department (name) VALUES (?)", data.name, (err, result) => {
            console.log("\nNew Department Created! See new Department below:");
            viewAllDepartments();
            promptUserMenu()
        })
    })
} 

// ADD EMPLOYEE 
const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Enter employee first name",
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter employee last name",
        }
    ])
    .then(data => {
        let params = [data.first_name, data.last_name];
        connection.query("SELECT title, id FROM role", (err, result) => {
            if (err) {
                throw err;
            }
            let roles = result.map(({ title, id }) => ({ name: title, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "role",
                    message: "Choose an employee role.",
                    choices: roles
                }
            ])
            .then(data => {
                let role = data.role;
                params.push(role)
                connection.query("SELECT first_name, last_name, id FROM employees WHERE manager_id IS NULL", (err, result) => {
                    if (err) {
                        throw err;
                    }
                    let managers = result.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id}));
                    managers.push({ name: "No Manager", value: null});
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Choose the employees manager.",
                            choices: managers
                        }
                    ])
                    .then(data => {
                        let manager = data.manager;
                        params.push(manager);
                        connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", params, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("New Employee Added!");
                            promptUserMenu();
                        })
                    })
                })
            })
        })
    })
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

//UPDATE SECTION