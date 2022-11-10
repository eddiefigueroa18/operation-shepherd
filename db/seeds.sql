-- This is the Data that is passed through to the differnet tables in the SCHEMA.sql file

-- Add the department data --
INSERT INTO departments(department_name)
VALUES  ("Administration"),
        ("Finance"),
        ("Engineering"),
        ("Marketing"),
        ("Legal");



-- Add the Roles data --
INSERT INTO roles(title, salary, department_id)
VALUES  ("CEO", 777000.00, 1),
        ("VP", 600000.00, 1),
        ("Regional Manager", 300000.00, 1),
        ("Accountant", 300000.00, 2),
        ("Salesperson", 80000.00, 2),
        ("Sofeware Engineer", 300000.00, 3),
        ("Developer", 250000.00, 3),
        ("Marketing Manager", 200000.00, 4),
        ("Social Media Marketer", 100000.00, 4),
        ("Legal Team Lead", 400000.00, 5),
        ("Lawyer", 300000.00, 5);



-- Add the Employees data --
INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES  ("Eduardo", "Figueroa", 1, null),
        ("Benjamin", "Figueroa", 1, 1),
        ("Kyle", "Doyle", 1, 1),
        ("David", "Pascual", 2, null),
        ("Daira", "Doyle", 2, 2),
        ("Ivy", "May", 3, null),
        ("Daniel", "Pascual", 3, 3),
        ("Natalie", "Figueroa", 4, null),
        ("Chloe", "Jensen", 4, 4),
        ("Isaac", "Jensen", 5, null),
        ("Theodore", "Van-Gaal", 5, 5);

