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
      })
    .catch((error) => {
      console.error(error);
    });
}


// function to view all departments
function viewDepartments() {
  // Query the database and display the results in a formatted table
  var query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
}

// function to add a department
function addDepartment() {
  // Prompt the user for department details and insert them into the database
}

// function to update an employee's role
function updateEmployeeRole() {
  // Prompt the user to select an employee and update their role
}

// Call functions based on user choices
