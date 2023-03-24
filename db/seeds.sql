INSERT INTO departments (department_name)
VALUES ("Service"),
       ("Finance");

INSERT INTO roles (title, Salary, department_id)
VALUES ("Customer Care" , 47000, 1),
       ("Help Service", 30000, 1),
       ("Accountant" , 50000, 2);
       
INSERT INTO employees (first_name, last_name, role_id, manager)
VALUES ("Eddy", "Brock", 1, NULL),
       ("Bruce", "Banner", 1, "Eddy Brock"),
       ("Peter", "Parker" , 1, "Eddy Brock"),
       ("Tony", "Stark" , 2, NULL),
       ("Pepper", "Potts" , 2, "Tony Stark"),
       ("Clark", "Kent", 3, NULL),
       ("Diana", "Prince" , 3, "Clark Kent"),
       ("Bruce", "Wayne" , 3, "Clark Kent"),
       ("Harley", "Quinn", 3, "Clark Kent");