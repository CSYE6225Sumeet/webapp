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


