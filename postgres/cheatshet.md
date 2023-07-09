Certainly! Here's a PostgreSQL cheat sheet with some commonly used commands and queries:

Database Operations
Create a database:

sql
Copy code
CREATE DATABASE database_name;
Connect to a database:

bash
Copy code
psql -U username -d database_name
List all databases:

sql
Copy code
\l
Switch to a different database:

sql
Copy code
\c database_name
Drop a database:

sql
Copy code
DROP DATABASE database_name;
Table Operations
Create a table:

sql
Copy code
CREATE TABLE table_name (
  column1 datatype1,
  column2 datatype2,
  ...
);
List all tables in the current schema:

sql
Copy code
\dt
View table structure:

sql
Copy code
\d table_name
Delete a table:

sql
Copy code
DROP TABLE table_name;
Insert data into a table:

sql
Copy code
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
Update data in a table:

sql
Copy code
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
Delete data from a table:

sql
Copy code
DELETE FROM table_name
WHERE condition;
Querying Data
Retrieve all records from a table:

sql
Copy code
SELECT * FROM table_name;
Retrieve specific columns from a table:

sql
Copy code
SELECT column1, column2, ... FROM table_name;
Filter records using a WHERE clause:

sql
Copy code
SELECT * FROM table_name
WHERE condition;
Sort records:

sql
Copy code
SELECT * FROM table_name
ORDER BY column ASC/DESC;
Limit the number of records returned:

sql
Copy code
SELECT * FROM table_name
LIMIT n;
User Management
Create a user:

sql
Copy code
CREATE USER username WITH PASSWORD 'password';
Grant privileges to a user:

sql
Copy code
GRANT privilege_type ON table_name TO username;
Revoke privileges from a user:

sql
Copy code
REVOKE privilege_type ON table_name FROM username;
List all users:

sql
Copy code
\du
Change a user's password:

sql
Copy code
ALTER USER username WITH PASSWORD 'new_password';
These are just a few examples of PostgreSQL commands and queries. PostgreSQL offers a wide range of features and capabilities, so make sure to refer to the PostgreSQL documentation for more detailed information and advanced usage.
