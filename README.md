
# My API - Company - Location Project

**Installation**

Create a directory where you'd like the API installed:

```bash
mkdir API-William
cd API-William
git clone https://github.com/willikoski/api-levels-project.git
cd api-levels-project/

```
 - Git init (Once inside)
 - Touch/Create 2 files .env .gitignore (assuming you'll push to github)
 -Inside your env file you will need to update the following sample sheet. (.env should never be shared)
 -You can grab a sha random generated key here: [SHA256 Generator Key](https://emn178.github.io/online-tools/sha256.html)
 ```
 JWT_SECRET=SHA GENERATE KEY
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@DATABASEBLOCK.zjvqipx.mongodb.net/DATABASENAME?retryWrites=true&w=majority 
```
 - Npm init -y 
 - Npm i express dotenv crypt jsonwebtoken mongoose (Packages we need installed)
 - Npm i -D nodemon jest supertest (Packages we need installed)
 - Open up VSCODE type code . to quick open
 - Go into the package.json file —> add “dev”: “nodemon” & "test": "jest" to the scripts section

 **This Should be done already but heres what it should look like:**
  ``` 
 {
  "name": "login-api",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "jest --coverage",
    "start": "node server.js",
    "dev": "nodemon"
  },  
  ```
  **Once setup you may use the terminal commands** 

  ```
-npm i
-npm run dev
-npm test
```

## Model Schemas

**User:**

- `username` (Required)
- `email` (Required)
- `password` (Required)
- `company` (ObjectID - Required)
- `locations` (ObjectID - Required)
- `level` (Default 1 - Required)

**Company:**

- `company` (Required)
- `locations` (Array / users may be part of multiple locations)

**Location:**

- `location` (String - Required)

## Router Page - LoginRouter.js

**User Router**

- `POST /register` - Create a new user
- `POST /login` - User login
- `PUT /:id` - Update user information
- `DELETE /:id` - Delete user (Authentication required)

**Company and Location Routes**

- `POST /createCompany` - Create a new company
- `POST /createLocation` - Create a new location

  ## Post Man
  **Create Company:**
  ```
  {
  "company": "test"
  }
  ```
  **Create Location:**
  ```
  {
  "company": "", // Id of company in here
  "locations": ["AC Bethesda", "AC DC", "AC OCEAN CITY"]
  }
  ```
  **Create User:**
  ```
  {
    "username": "test",
    "email": "test.doe@example.com",
    "password": "password123",
    "company": "", // NAME of company
    "locations": [""], // locations ID of all created in any company block 
    "level": 1
  }
  ```
  **Update:**
  ```
  {
    "password": "",
    "company": "", // OBJ ID OF COMPANY
    "locations": [""], // OBJ ID OF LOCATION I WANT ADDED
    "level": 2
  }
 ```
  **Delete User:**
  
  Must need bearer token of user created
  localhost:3000/IDHERE
  
