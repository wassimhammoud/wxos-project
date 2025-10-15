ت:


# WXOS Project

## Project Description
WXOS Project is a sample project for designing a database and a login interface using **Node.js**, **Express**, and **PostgreSQL** (or Oracle).  
The project includes:  
- A database with a Users table  
- A simple frontend (`index.html` + `script.js`)  
- Node.js server (`server.js`) to handle requests  
- ER diagram (`WX.drawio`) showing the database structure  

## Requirements
- Node.js >= 18  
- npm  
- Git  
- PostgreSQL or Oracle database  
- Modern web browser (Chrome, Firefox, etc.)  

## Installation

1. Clone the repository:
git clone https://github.com/wassimhammoud/wxos-project.git
cd wxos-project


2. Install dependencies:

```bash
npm install
```

3. Setup the database:

* Create a new database
* Import tables from the provided SQL files (if any)

## Running the Project

### Start the server

```bash
node server.js
```

Or use **nodemon** for auto-reload during development:

```bash
npm install -g nodemon
nodemon server.js
```

### Open the frontend

Open your browser and go to:

```
http://localhost:3000/index.html
```

## Usage

* Enter username and password to log in
* Once logged in, test the available features (CRUD operations or others, depending on the project)




