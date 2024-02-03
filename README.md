**My API - Company - Location Project**

**Installation**
Make a directory where you'd like the api installed
```
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
**Model Schemas**

**User:** Username - Required 
| email - Required  
| password - Required 
| company - ObjectID - Required 
| locations - ObjectID - Required 
| level - Default 1 - Required
**Company:** Company - Required 
[Locations] Array / users may be part of multiple locations
**Location:** Location - String - Required 

**Router Page - LoginRouter.js**
**User Router**
 - router.post('/register', userController.createUser)
 - router.post('/login', userController.loginUser)
 - router.put('/:id', userController.updateUser)
 - router.delete('/:id', userController.auth, userController.deleteUser)
 
  **Company and Location Routes** 
 - router.post('/createCompany', userController.createCompany)
 - router.post('/createLocation', userController.createLocation)

  
