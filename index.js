const inquirer = require('inquirer');
const express = require('express');
require('dotenv').config();
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// *****************************************to do DO A QUERY TO DET THE DEPARTMENT ID WHEN ADDING A ROLE

// PROBABY THE SAME GETTING A ROLE ID WHEN ADDING AN EMPLOYEE 











// Connect to database
// const db = mysql.createConnection(
//   {
//     host: 'localhost',
//     // MySQL username,
//     user: process.env.DB_USER,
//     // MySQL password
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
//   },
//   console.log(`Connected to the courses_db database.`)
// ).catch((err) => {
//   console.log(err);
// })
let db
try {
  db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the courses_db database.`, process.env.DB_USER, process.env.DB_NAME, process.env.DB_PASSWORD)
  )
} catch (err) {
  console.log(err);
}

// let department_name = [];
// 'view all departments', 'view all roles', 'view all employees', 
const optionsQuestion =
  [{
    type: 'list',
    message: 'What would you like to do?',
    name: 'options',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'I am finished']
  }
  ]

const departmentQuestions = {
  type: 'input',
  message: 'What is the name of the Department?',
  name: 'department',
}

const roleQuestions = [
  {
    type: 'input',
    message: 'What is the job title?',
    name: 'title',
  },
  {
    type: 'list',
    message: 'Which department does it belong to?',
    name: 'dep_name',
    choices: [],
  },
  {
    type: 'input',
    message: `What is the job's salary?`,
    name: 'salary',
  },
]
 
const employeeQuestions = [
  {
    type: 'input',
    message: `What is the employee's first name?`,
    name: 'first_name',
  },
  {
    type: 'input',
    message: `What is the employee's last name?`,
    name: 'last_name',
  },
  {
    type: 'list',
    message: `What is the employee's role?`,
    name: 'job_title',
    choices: [],
  },
  {
    type: 'list',
    message: `Who is the employee's manager?`,
    name: 'manager',
    choices: [],
  },
]

const updateQuestion = [
  {
    type: 'list',
    message: `Which employee's role would you like to update?`,
    name: 'employee',
    choices: [],
  },
  {
    type: 'list',
    message: `Which role do you want to assign to the selected employee?`,
    name: 'switchRole',
    choices: [`SELECT title FROM roles`],
  }
]
// let departmentNames
var callQueries = () => {
  db.query(`SELECT department_name FROM departments`,
    (err, result) => {
      if (err) {
        if(err) {console.log(err) };
      }
      roleQuestions[1].choices = result.map(r => `${r.department_name}`);
    });

  db.query(`SELECT title FROM roles`,
    (err, result) => {
        if(err) {console.log(err) };
      employeeQuestions[2].choices = result.map(r => `${r.title}`);
      updateQuestion[1].choices = result.map(r => `${r.title}`)
    });

  db.query(`SELECT first_name, last_name FROM employees`,
    (err, result) => {
        if(err) {console.log(err) };
      employeeQuestions[3].choices = result.map(r => `${r.first_name} ${r.last_name}`);
      updateQuestion[0].choices = result.map(r => `${r.first_name} ${r.last_name}`);
    });
}

const startQuestions = () => {
  callQueries();
  inquirer
    .prompt(optionsQuestion)
    .then((response) => {
      if (response.options === 'add a department') {
        inquirer
          .prompt(departmentQuestions)
          .then((response) => {
            db.query(`INSERT INTO departments(department_name)
                        VALUES ('${response.department}');`,
              (err, result) => {
                  if(err) {console.log(err) };
                console.log(`Successfully added ${response.department} as a department`);
                startQuestions();
              });

          })

      } else if (response.options === 'add a role') {
        console.log(roleQuestions);
        callQueries();
        inquirer
          .prompt(roleQuestions)
          .then((response) => {
            let departmentId
            db.query(`SELECT * FROM departments WHERE department_name = '${response.dep_name}'`, (err, result) => {
              if(err) {console.log(err) };
              departmentId = result[0].id
              db.query(`INSERT INTO roles(title, department_id, salary)
                VALUES  ('${response.title}', '${departmentId}', '${response.salary}');`, (err, result) => {
                if(err) {console.log(err) };
                console.log(`Successfully added ${response.title} as a role`);
                startQuestions();
              });
            })
          });

      } else if (response.options === 'add an employee') {
        inquirer
          .prompt(employeeQuestions)
          .then((response) => {
            let roleId 
            // *****************************************************
            db.query(`SELECT * FROM roles WHERE title = '${response.job_title}'`, (err, result) => {
              // console.log(result);
              if(err) {console.log(err) };
              roleId = result[0].id
            db.query(`INSERT INTO employees(first_name, last_name, role_id, manager)
          VALUES  ('${response.first_name}', '${response.last_name}', '${roleId}', '${response.manager}');`, (err, result) => {
                if(err) {console.log(err) }; 
                console.log(`Successfully added ${response.first_name} ${response.last_name} as an employee`);      
              startQuestions();
            });
          })
          })

      } else if (response.options === 'update an employee role') {
        inquirer
          .prompt(updateQuestion)
          .then((response) => {
            let roleId
            db.query(`Select * FROM roles WHERE title = '${response.switchRole}'`, (err, result) => {
              if(err) {console.log(err) };
              roleId = result[0].id
              db.query(`UPDATE employees
                    JOIN roles ON employees.role_id = roles.id
                    SET role_id = ${roleId}
                    WHERE first_name = '${response.employee.split(" ")[0]}' AND last_name = '${response.employee.split(" ")[1]}';`, (err, result) => {
                  console.log(err);
                  console.log(`Successfully changed ${response.employee}'s role!`);
                startQuestions();
              });
            });
          });

      } else if (response.options === 'view all employees') {
        callQueries();
        db.query(`SELECT employees.id, employees.first_name, 
              employees.last_name, employees.manager, roles.title, roles.salary, departments.department_name FROM employees 
              JOIN roles ON employees.role_id = roles.id 
              JOIN departments ON roles.department_id = departments.id;`, (err, result) => {
            if(err) {console.error(err)};
          startQuestions();
          console.log(result);
        });

      } else if (response.options === 'view all departments') {
        callQueries();
        db.query(`SELECT * FROM departments;`, (err, result) => {
            if(err) { console.error(err) };
          console.log(result);
        });
        startQuestions();
      } else if (response.options === 'view all roles') {
        callQueries();
        db.query(`SELECT roles.id, roles.title, roles.salary, departments.department_name 
          FROM roles 
          JOIN departments ON roles.department_id = departments.id;`, (err, result) => {
            if(err) {console.log(err) };
          console.log(result);
          startQuestions();
        });
      } else {
        console.log('Thank you for creating your employee datbase!');
      }
    })
    .catch((err) => new Error(err));

}

startQuestions()