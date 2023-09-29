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
    // Fetch a list of employees so the user can choose from them
    const employeeListQuery = 'SELECT id, first_name, last_name FROM employee';
    db.query(employeeListQuery)
      .then((employees) => {
        // This code converts the list of employees into a format suitable for inquirer
        const employeeChoices = employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));
        // Code to prompt the user to select an employee below
        inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to update:',
            choices: employeeChoices,
          },
        ])
        .then((answers) => {
          const newRoleId = 1; 
          const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
          const updateValues = [newRoleId, answers.employeeId];

          db.query(updateQuery, updateValues)
          // Prompt user after updating the role
            .then(() => {
              console.log('Employee role updated successfully!');
              init(); 
            })
            .catch((error) => {
              // Prompt user if an error occurs
              console.error('Error updating employee role:', error);
              init(); 
            });
        });
    })
    .catch((error) => {
      console.error('Error fetching employee list:', error);
      init(); // Prompt the user again after an error
    });
}

// Call functions based on user choices
