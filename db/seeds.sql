-- This is the Data that is passed through to the differnet tables in the SCHEMA.sql file

-- Add the department data --
INSERT INTO department(name)
VALUES  ("Administration"),
        ("Finance"),
        ("Engineering"),
        ("Marketing"),
        ("Legal");



-- Add the Roles data --
INSERT INTO roles(title, salary, department_id)
VALUES  ("CEO", 777000, 1),
        ("VP" 600000, 1)
        ("Regional Manager" 300000, 1),
        ("Accountant" 300000, 2),
        ("Salesperson" 80000, 2),
        ("Sofeware Engineer" 300000, 3),
        ("Developer" 250000, 3),
        ("Marketing Manager" 200000, 4),
        ("Social Media Marketer" 100000, 4),
        ("Legal Team Lead" 400000, 5),
        ("Lawyer" 300000, 5);



-- Add the Employees data --
INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES  ("Eduardo", "Figueroa", 1, null),
        ("Benjamin", "Figueroa", 1, null),
        ("Kyle", "Doyle", 1, null),
        ("David", "Pascual", 2, null),
        ("Daira", "Doyle", 2, null),
        ("Ivy", "May", 3, null),
        ("Daniel", "Pascual", 3, null),
        ("Natalie", "Figueroa", 4, null),
        ("Chloe", "Jensen", 4, null),
        ("Isaac", "Jensen", 5, null),
        ("Theodore", "Van-Gaal", 5, null);

