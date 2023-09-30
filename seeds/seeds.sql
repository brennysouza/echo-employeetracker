-- Insert departments
INSERT INTO department (name) VALUES
    ('HR'),
    ('Finance'),
    ('IT'),
    ('Operations');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
    ('HR Manager', 85000.00, 1),
    ('Payroll Coordinator', 60000.00, 1),
    ('Financial Analyst', 75000.00, 2),
    ('Accountant', 70000.00, 2),
    ('Software Engineer', 120000.00, 3),
    ('Full-stack Developer', 80000.00, 3),
    ('Director of Operations', 140000.00, 4),
    ('Operations Manager', 100000.00, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Vicky', 'Snicket', 1, NULL),
    ('Shelly', 'Smith', 2, 1),
    ('Bob', 'Saget', 3, NULL),
    ('Doris', 'Zamora', 4, 3),
    ('John', 'Piper', 5, NULL),
    ('Brenny', 'Souza', 6, 5),
    ('Camile', 'Martins', 7, NULL),
    ('Brad', 'Pitt', 8, 7);

