// Defined variables and requirements
const inquirer = require("inquirer");
const connection = require("./db/connection")
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
                {
                    name: null,
                    value: "View all departments"
                },
                {
                    name: null,
                    value: "View all roles"
                },
                {
                    name: null,
                    value: "View all employees"
                },
                {
                    name: null,
                    value: "Add a Department"
                },
                {
                    name: null,
                    value: "Add a role"
                },
                {
                    name: null,
                    value: "Add an employee"
                },
                {
                    name: null,
                    value: "Update an employee role"
                },
                {
                    name: null,
                    value: "Exit"
                }
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
                process.exit();
                break;

            default:
                console.log("--------ending session--------")
        }
    })
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// VIEW SECTION
// View all departments
const viewAllDepartments = () => {
    connection.query("SELECT * FROM departments", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
};

//View all roles
const viewAllRoles = () => {
    connection.query("SELECT * FROM roles", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
};

// View all employees 
const viewAllEmployees = () => {
    connection.query("SELECT * FROM employees", function (err, result) {
        console.log("\n");
        console.table(result);
        promptUserMenu();
    })
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// ADDING SECTION
// Add a Department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "newDepName",
            message: "What is the name of the new department? "
        }
    ])
        .then((data) => {
            let newDept = [data.newDepName];
            connection.query("INSERT INTO departments (department_name) VALUES (?)", newDept, (err) => {
                if (err) {
                    throw err;
                }
                console.log("\nNew Department Created! See new Department below:");
                viewAllDepartments();
                promptUserMenu();

            })
        })
};

//ADD ROLE
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of new role?',
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is the salary for the new role?',
        }
    ])
        .then(answer => {
            let params = [answer.title, answer.salary];
            connection.query('SELECT * FROM departments', (err, result) => {
                if (err) {
                    console.log(err);
                }
                let depts = result.map(({ name, id }) => ({ name: name, value: id }));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "dept",
                        message: "Choose which department the new role is a part of.",
                        choices: depts
                    }
                ])
                    .then(answer => {
                        let dept = answer.dept;
                        params.push(dept);
                        connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', params, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("Role added");
                            return promptUserMenu();
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
            connection.query("SELECT title, id FROM roles", (err, result) => {
                if (err) {
                    throw err;
                }
                let roles = result.map(({ title, id }) => ({ name: title, value: id }));
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
                            let managers = result.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
                            managers.push({ name: "No Manager", value: null });
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
                                        console.log("New Employee Added! See Results below");
                                        promptUserMenu();
                                    })
                                })
                        })
                    })
            })
        })
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

//UPDATE SECTION
//Update Employee Role
const updateEmployeeRole = () => {
    connection.query("SELECT first_name, last_name, id FROM employees", (err, result) => {
        if (err) {
            console.log(err);
        }
        let employees = result.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
        inquirer.prompt([
            {
                type: "list",
                name: "employeeUpdate",
                message: "Which employee's role would you like to change?",
                choices: employees
            }
        ])
            .then(answer => {
                let employeeChoice = answer.employeeUpdate;
                let params = [employeeChoice];
                connection.query("SELECT title, id FROM roles", (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    let roles = result.map(({ title, id }) => ({ name: title, value: id }));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "roleUpdate",
                            message: "What is their new role?",
                            choices: roles
                        }
                    ])
                        .then(answer => {
                            let roleChoice = (answer.roleUpdate);
                            params.unshift(roleChoice);
                            connection.query("SELECT first_name, last_name, id FROM employees WHERE manager_id IS NULL", (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                                let managers = result.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
                                managers.push({ name: "No manager", value: null });
                                inquirer.prompt([
                                    {
                                        type: "list",
                                        name: "newManager",
                                        message: "Choose the employee's new manager, if any.",
                                        choices: managers
                                    }
                                ])
                                    .then(answer => {
                                        let newManager = (answer.newManager);
                                        params.unshift(newManager);
                                        connection.query("UPDATE employees SET manager_id = ?, role_id = ? WHERE id = ?", params, (err) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            console.log("Employee updated!");
                                            return promptUserMenu();
                                        })
                                    })
                            })
                        })


                })

            })

    })
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

promptUserMenu();
