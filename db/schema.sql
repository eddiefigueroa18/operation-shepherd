DROP DATABASE IF EXISTS management_db;
CREATE DATABASE management_db;

USE management_db;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ --

-- 3 Tables: Department, Roles & Employees -- 
CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
    -- (CONSTRAINT fk_department)? --
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES roles(id), 
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);