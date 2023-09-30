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
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all employees',
          'Add a department',
          'Update an employee\'s role',
          'Exit',
        ],
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
        case 'Add a department':
          addDepartment();
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
      const [employees] = await connectionPool.query('SELECT * FROM employee');
      console.table(employees);
      init();
    } catch (error) {
      console.error('Error viewing employees:', error);
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
