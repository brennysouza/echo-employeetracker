const inquirer = require('inquirer');
// Code below connects to mysql database
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool function
function getConnection() {
  return mysql.createConnection(
      {
        host: 'localhost',
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database:  process.env.DB_NAME,
      }
  );
}



// Initializes the application
init();

function init() {
  // inquirer to prompt users with these questions
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all employees',
          'View all roles',
          'Add a department',
          'Add an employee',
          'Add a role',
          'Update an employee\'s role',
          'Exit',
        ],
        pageSize: 8,
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Update an employee\'s role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          process.exit(0);
      }
      })
    .catch((error) => {
      console.error(error);
    });
}


// function to view all departments
async function viewDepartments() {
  // Code queries the database and display the results in a formatted table
  try {
  const [results] = await connectionPool.query('SELECT * FROM department');
      console.table(results);
      init(); 
  }
    // Prompt the user again after an error
    catch (error) {
      console.error('Error viewing departments:', error);
      init(); 
    }
  }

  async function viewEmployees() {
      try {
        // Modify the SQL query to retrieve employee details along with title, salary, department, and manager
        const query = `
          SELECT e.id, e.first_name, e.last_name, r.title AS role, r.salary, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager
          FROM employee e
          LEFT JOIN role r ON e.role_id = r.id
          LEFT JOIN department d ON r.department_id = d.id
          LEFT JOIN employee m ON e.manager_id = m.id
        `;
        const [employees] = await connectionPool.query(query);
    
        // Display the formatted results
        console.table(employees);
        init();
      } catch (error) {
        console.error('Error viewing employees:', error);
        init();
      }
    }
  //   try {
  //     const [employees] = await connectionPool.query('SELECT * FROM employee');
  //     console.table(employees);
  //     init();
  //   } catch (error) {
  //     console.error('Error viewing employees:', error);
  //     init();
  //   }
  // }

  // async function viewRoles() {
  //   try {
  //     const [roles] = await connectionPool.query('SELECT * FROM role');
  //     console.table(roles);
  //     init();
  //   } catch (error) {
  //     console.error('Error viewing roles:', error);
  //     init();
  //   }
  // }

// function to add a department
async function addDepartment() {
  // Code prompts user for department details and insert them into the database
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the new department:',
      },
    ])
    .then(async (answers) => {
      // Insert the new department into the database
      const insertQuery = 'INSERT INTO department (name) VALUES (?)';
      const insertValues = [answers.departmentName];
    
      try {
      await connectionPool.query(insertQuery, insertValues)
          console.log(`Department '${answers.departmentName}' added successfully!`);
          init(); 
        } catch (error) {
          console.error('Error adding department:', error);
          init();
        }
    });
}

async function addEmployee() {
  // Code prompts user for employee details and insert them into the database
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the first name of the new employee:',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the last name of the new employee:',
      },
    ])
    .then(async (answers) => {
      const firstName = answers.firstName; 
      const lastName = answers.lastName;   

      console.log('First Name:', firstName);
      console.log('Last Name:', lastName);

      // Insert the new employee into the database
      const insertQuery = 'INSERT INTO employee (first_name, last_name) VALUES (?, ?)';
      const insertValues = [firstName, lastName];
      // const insertValues = [answers.employeeName];
    
      try {
      await connectionPool.query(insertQuery, insertValues)
          console.log(`Employee '${firstName} ${lastName}' added successfully!`);
          init(); 
        } catch (error) {
          console.error('Error adding employee:', error);
          init();
        }
    });
}

// Define the function to fetch departments from the database
async function fetchDepartmentsFromDatabase() {
  try {
    // Execute a query to fetch departments from your database
    const [departments] = await connectionPool.query('SELECT * FROM department');
    // Return the departments
    return departments;
  } catch (error) {
    // Handle any errors that occur during the database query
    throw error;
  }
}

async function addRole() {
  try {
      // Implement fetchDepartmentsFromDatabase()
  const departments = await fetchDepartmentsFromDatabase(); 
  // Code prompts user for role details and insert them into the database
   const answers = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'Enter the name of the new role:',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter the salary of the new role:',
      },
      {
        type: 'list',
        name: 'roleDepartment',
        message: 'Select the department of the new role:',
        // Uses the fetched departments in db to populate the choices
        choices: [
          ...departments.map(department => department.name),
          new inquirer.Separator(),
          'Add New Department',
        ],
        pageSize: 10, // Set the number of choices per page
        loop: false, // Disable looping through the choices
      },
    ])
    const roleName = answers.roleName;
    const roleSalary = parseFloat(answers.roleSalary);
    const selectedDepartment = departments.find(
      (department) => department.name === answers.roleDepartment
    );

    if (!selectedDepartment) {
      throw new Error('Selected department not found.');
    }

    const roleDepartment = selectedDepartment.id; // Use the department's ID

    // Insert the new role into the database
    const insertQuery =
      'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    const insertValues = [roleName, roleSalary, roleDepartment];

    await connectionPool.query(insertQuery, insertValues);
    console.log(`Role '${roleName}' added successfully!`);
    init();

    if (answers.roleDepartment === 'Add New Department') {
      await addDepartment(); // Add department logic (implement this function)
      departments = await fetchDepartmentsFromDatabase();
    }

  } catch (error) {
    console.error('Error adding role:', error);
    init();
  }
}

// Define the function to fetch employees from the database
async function fetchEmployeesFromDatabase() {
  try {
    // Execute a query to fetch employees from your database
    const [employees] = await connectionPool.query('SELECT * FROM employee');
    return employees;
  } catch (error) {
    // Handle any errors that occur during the database query
    throw error;
  }
}

async function fetchRolesFromDatabase() {
  try {
    // Execute a query to fetch roles from your database
    const [roles] = await connectionPool.query('SELECT * FROM role');
    return roles;
  } catch (error) {
    // Handle any errors that occur during the database query
    throw error;
  }
}


async function updateEmployeeRole() {
  try {
    const db = await getConnection();

    // Fetch the list of departments from the database
    const [departments] = await db.query('SELECT * FROM department');
    const employees = await fetchEmployeesFromDatabase();
    const roles = await fetchRolesFromDatabase();

    const input = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Choose an employee',
        choices: employees.map((employee) => `${employee.first_name} ${employee.last_name}`),
      },
      {
        type: 'list',
        name: 'role',
        message: 'Enter the employee\'s new role:',
        choices: roles.map((role) => role.title),
      },
      {
        type: 'list',
        name: 'department',
        message: 'Choose the department for the new role:',
        choices: departments.map((department) => department.name),
      },
    ]);

    // Close the connection before proceeding
    closeConnection(db);

    const selectedEmployee = employees[0].find(
      (employee) => `${employee.first_name} ${employee.last_name}` === input.employee
    );
    const newRoleId = roles[0].find((role) => role.title === input.role).id;
    const selectedDepartment = departments.find((department) => department.name === input.department);

    if (!selectedEmployee || !selectedDepartment) {
      console.log('Employee or department not found.');
      rePrompt(); // Call rePrompt without the 'db' argument
      return;
    }

    // Update the employee's role and salary in the chosen department
    const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const updateValues = [newRoleId, selectedEmployee.id];

    await db.query(updateQuery, updateValues);

    console.log(`Employee role updated successfully to ${input.role} in the ${input.department} department.`);
    rePrompt();
  } catch (error) {
    console.error('Error updating employee role:', error);
    rePrompt();
  }
}

function rePrompt() {
  promptUser();
}




