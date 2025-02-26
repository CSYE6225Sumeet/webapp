# webapp

This is a web application built with Node.js, Express, and Sequelize for MySQL. It provides a health check endpoint (`/healthz`) to monitor the status of the application and database.

---

## Prerequisites

Before you can build and deploy this application locally, ensure you have the following installed:

1. **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/).
   - Verify installation:
     ```bash
     node -v
     npm -v
     ```

2. **MySQL**: Install MySQL on your machine.
   - Download MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/).
   - Verify installation:
     ```bash
     mysql --version
     ```

3. **Git**: Install Git to clone the repository.
   - Download Git from [git-scm.com](https://git-scm.com/).
   - Verify installation:
     ```bash
     git --version
     ```

4. **Environment Variables**:
   - Create a `.env` file in the root directory of the project.
   - Add the following variables:
     ```env
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=your_database_name
     ```

---

## Build and Deploy Instructions

Follow these steps to build and deploy the application locally:

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/your-username/your-repo-name.git

cd your-repo-name
```
### 2. Install Dependencies
Install the required Node.js dependencies:
```bash
$npm install
```
### 3. Set Up the Database
-> Log in to MySQL:
```bash
mysql -u your_mysql_username -p
```

-> Create a database:
```bash
CREATE DATABASE your_database_name;
```

-> Exit MySQL:
```bash
exit;
```

### 3. To run the application
    $node app.js


### 4. To run shell script
```bash
bash setup_web.sh
```

## Build and Deploy on an Instance
The shell script will do the following tasks:
1. Updates & upgrades the packages
2. Updates the packages on the system.
3. Installs MySQL Database.
4. Creates a database in the MySQL DB.
5. Creates a new Linux group for the application.
6. Creates a new user of the application.
7. Unzips the application in /opt/csye6225 directory.
8. Updates the permissions of the folder and artifacts in the directory.


### 1. Create an Instance

### 2. Connect to that instance using the ssh command
```bash
ssh -i "ssh-key" username@ip
```

### 3. Send the shell script to the instance using scp command
```bash
scp -i "ssh-key" setup_web.sh username@ip:/path/
```

### 4. Run the shell script for setup
```bash
bash setup_web.sh
```

### GitHub Workflow CI
We have implemented Continuous Integration (CI) using GitHub Actions to ensure code quality and prevent faulty code from being merged into the main branch.

### Created AMIs with Packer


### Packer Format And Validate
```bash
packer fmt
packer init
packer validate
```

### Packer Build
```bash
packer build
```