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
    // console.log("Connection to management_db Successful.") 
);


//=============TEST=================TEST=================TEST========================//
// const connection = require("./db/connection");
// const express = require("express");
// const inquirer = require("inquirer");
// const PORT = process.env.PORT || 3001;
// const app = express();

// // express middleware
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

// // Default response for any other request (Not found)
// app.use((req, res) => {
//   res.status(404).end();
// });

// // Start server after DB connection
// connection.connect(err => {
//   if (err) throw err;
//   console.log('Database connected.');
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     promptUserMenu();
//   });
// });
//========================TEST================TEST===============TEST=========//





//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

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
                updateEmployeeRole();
                break;

            case "Exit":
                exitApp();
                break;
        }
    })
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// VIEW SECTION
// VIEW ALL DEPARTMENTS
const viewAllDepartments = () => {
    connection.query("SELECT * FROM department", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
};

//VIEW ALL ROLES
const viewAllRoles = () => {
    connection.query("SELECT * FROM roles", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
};

// VIEW ALL EMPLOYEES 
const viewAllEmployees = () => {
    connection.query("SELECT * FROM employees", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

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
}; 

//ADD ROLE
const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the new role? ",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for the new role? ",
        }
    ])
    .then(data => {
        let params = [data.title, data.salary];
        connection.query("SELECT * FROM department", (err, result) => {
            if (err) {
                throw err;
            }
            let departments = result.map(({ name, id}) => ({ name: name, value: id}));
            inquirer.prompt([
                {
                    type: "input",
                    name: "dept",
                    message: "Choose which department the new role is a part of.",
                    choices: departments
                }
            ])
            .then(data => {
                let dept = data.dept;
                params.push(dept);
                connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?,)", params, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("New Role Added");
                    promptUserMenu();
                })
            })
        })
    })
};

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
//UPDATE EMPLOYEE
const updateEmployeeRole = () => {
    const roleArray = [];
    const employeeArray = [];
// Populates role array with all roles
    connection.query("SELECT * FROM role", function (err, results) {
        for (let i = 0; i < results.length; i++) {
            roleArray.push(results[i].title);
        }
// Populates employee array with all employees
    connection.query("SELECT * FROM employee", function (err, results) {
        for (let i = 0; i < results.length; i++) {
        let employeeName = `${results[i].first_name} ${results[i].last_name}`
        employee.push(employeeName);
        }
        return inquirer.prompt([
            {
                type: "list",
                message: "Which Employee would would you like to update? ",
                name: "employee",
                choices: employeeArray
            },
            {
                type: "input",
                message: "What is the Employee's new role? ",
                name: roleArray
            },
        ])
        .then((data) => {
        // Get role id
            connection.query("SELECT id FROM role WHERE role.title = ?;", data.role, (err, results) => {
                role_id = results[0].id;
                connection.query("SELECT id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?;", data.employee.split(" "), (err, results) => {
                    connection.query("UPDATE employee SET role_id = ? WHERE id = ?;", [role_id, results[0].id], (err, results) => {
                        console.log("\nEmployee role updated. See results below: ");
                        viewAllEmployees();
                        promptUserMenu();
                    })
                })
            })
        })
    })

    })
}; 

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

//EXIT
const exitApp = () => {
    console.log('\nThank you, Goodbye!')
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

promptUserMenu();
