const inquirer = require('inquirer');
// Code below connects to mysql database
const mysql = require('mysql2/promise');
require('dotenv').config();


// Create a connection pool using the promise-based API
const connectionPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust this based on your needs
  queueLimit: 0,
});

// // Code logs any database connection errors
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//   } else {
//     console.log('Connected to the database');
//   }
// });

// Initializes the application
init();

function init() {
  // inquirer to prompt users with these questions
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all employees',
          'View all roles',
          'Add a department',
          'Add an employee',
          'Add a role',
          'Update an employee role',
          'Exit',
        ],
        pageSize: 8,
      },
    ])
    .then((answers) => {
      switch (answers.choices) {
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
        case 'Update an employee role':
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
      const [employees] = await connectionPool.query('SELECT * FROM employee');
      console.table(employees);
      init();
    } catch (error) {
      console.error('Error viewing employees:', error);
      init();
    }
  }

  async function viewRoles() {
    try {
      const query = `
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        LEFT JOIN department ON role.department_id = department.id
      `;
      const [roles] = await connectionPool.query(query);
      console.table(roles);
      init();
    } catch (error) {
      console.error('Error viewing roles:', error);
      init();
    }
  }
  

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

// function to update an employee's role
async function updateEmployeeRole() {
  // Prompt the user to select an employee and update their role
    // Fetch a list of employees so the user can choose from them
    const employeeListQuery = 'SELECT id, first_name, last_name FROM employee';

   try {

    const [employees] = await connectionPool.query(employeeListQuery);
    // This code converts the list of employees into a format suitable for inquirer
    const employeeChoices = employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));
        // Code to prompt the user to select an employee below
        
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to update:',
            choices: employeeChoices,
          },
        ]);

          const newRoleId = 1; 
          const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
          const updateValues = [newRoleId, answers.employeeId];

          await connectionPool.query(updateQuery, updateValues);
          // Prompt user after updating the role
              console.log('Employee role updated successfully!');
              init(); 
            } catch (error) {
              // Prompt user if an error occurs
              console.error('Error updating employee role:', error);
              init(); 
            }
        }
    
//     .catch((error) => {
//       console.error('Error fetching employee list:', error);
//       init(); // Prompt the user again after an error
//     });
// }