-- Schema file, below is the database
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;
-- Departments table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE 
);
-- Employee roles table
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE,
    salary DECIMAL(10, 2),
    department_id INT,
    FOREIGN KEY (department_id) 
        REFERENCES department(id)
);
-- Employee names
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
        REFERENCES role(id),
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
);
