const inquirer = require('inquirer');
// Import database connection
const db = require('./db');

// Initialize the application
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
        case 'Add a department':
          addDepartment();
          break;
        case 'Update an employee\'s role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          process.exit(0);
          break;
      }
      })
    .catch((error) => {
      console.error(error);
    });
}


// function to view all departments
function viewDepartments() {
  // Code queries the database and display the results in a formatted table
  const query = 'SELECT * FROM department';
  db.query(query)
  // Prompt the user again after displaying the results
    .then((results) => {
      console.table(results);
      init(); 
    })
    // Prompt the user again after an error
    .catch((error) => {
      console.error('Error viewing departments:', error);
      init(); 
    });
}

// function to add a department
function addDepartment() {
  // Code prompts user for department details and insert them into the database
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the new department:',
      },
    ])
}

// function to update an employee's role
function updateEmployeeRole() {
  // Prompt the user to select an employee and update their role
}

// Call functions based on user choices
