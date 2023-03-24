const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the courses_db database.`)
);


// 'view all departments', 'view all roles', 'view all employees', 
const optionsQuestion = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'options',
    choices: ['view all departments', 'view all roles', 'view all employees, add a department', 'add a role', 'add an employee', 'update an employee role'],
    }

const departmentQuestions = {
    type: 'input',
    message: 'What is the name of the Department?',
    name: 'department',
}

const roleQuestions = [
    {
        type: 'list', 
        message: 'What is the job title?',
        name: 'title',
    },    
    {
        type: 'list', 
        message: 'Which department does it belong to?',
        name: 'dep_id',
        // ********************************************
        options: [`list, of, departments`],
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
    type: 'input', 
    message: `What is the employee's role?`,
    name: 'job_title',
},
{
  type: 'list', 
  message: `Who is the employee's manager?`,
  name: 'manager',
  // ***************************find an way to set employoees first and last names as an array*****************
  options: [`list, of, managers`],
},
]

const updateQuestion = {
  type: 'list',
  message: `Which employee's role would you like to update?`,
  name: 'employee',
  choices: ['SELECT first_name, last_name FROM employees'],
  }

inquirer
  .prompt(optionsQuestion) 
  .then((response) => {
    if(err){
      console.error(err);
    }
    console.log(response.options);
    if(response.options === 'add a department') {
        inquirer
            .prompt(departmentQuestions)
            .then((response) => {
              if(err){
                console.error(err);
              }
                db.query(`INSERT INTO departments(department_name)
                        VALUES (${response.department});`, 
                        (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    console.log(result);
                  });

            }
                )
    } else if (response.options === 'add a role') {
        inquirer
            .prompt(roleQuestions)
            .then((response) => {
              if(err){
                console.error(err);
              }
                db.query(`INSERT INTO roles(job_title, department_id, salary)
                VALUES  (${response.title}, ${response.dep_id}, ${response.salary});`, (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    console.log(result);
                  });

            })
    } else if (response.options === 'add an employee') {
      inquirer
      .prompt(employeeQuestions)
      .then((response) => {
          db.query(`INSERT INTO employees(first_name, last_name, job_title, manager)
          VALUES  (${response.first_name}, ${response.last_name}, ${response.job_title}, ${response.manager});`, (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(result);
            });

      })
    } else if (response.options === 'update an employee role') {
      inquirer
      .prompt(updateQuestions)
      .then((response) => {
        // figure out how to change the role id to match the roles name given
          db.query(`UPDATE employees
                    JOIN roles ON employees.role_id = roles.id
                    SET role_id = responce.titles.id
                    
                    WHERE first_name, last_name = ${response.employee};`, (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(result);
            });

      });
    } else if (response.options === 'view all employees') {
          db.query(`SELECT employees.id, employees.first_name, 
              employees.last_name, employees.manager, roles.title, roles.salary, departments.department_name FROM employees 
              JOIN roles ON employees.role_id = roles.id 
              JOIN departments ON roles.department_id = departments.id;`, (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(result);
            });
    } else if (response.options === 'view all departments') {
      db.query(`SELECT * FROM departments;`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(result);
        });
    } else if (response.options === 'view all roles') {
      db.query(`SELECT roles.id, roles.title, roles.salary, departments.department_name 
          FROM roles 
          JOIN departments ON roles.department_id = departments.id;`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(result);
        });
} 
});