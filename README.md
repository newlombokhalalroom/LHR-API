<div align="center">

# Lombok Halal Room API

Teknik Informatika - Universitas Mataram 2023

## About

### Tech

![badge](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![badge](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![badge](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)

### Development Team

| ID | NAMA |
----------------|------------------
F1D020017 | [Diaz Khalid Ananda](https://github.com/diazkhalid)
F1D020047 | [Mahendra Putra Raharja](https://github.com/OmMahen)
F1D021111 | [Dinta](https://github.com/dinta0623)

</div>

## Getting Started

### Prerequisites
Before you start, make sure you have the following software:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) 
- [PostgreSQL](https://www.postgresql.org/download/)

### Creating a Database
Here are step-by-step instructions for creating a PostgreSQL database using the Command Line Interface (CLI):
1. Open your terminal or command prompt. Ensure that PostgreSQL is installed by running:
   ```
   SQL --version
   ```
2. Log in to PostgreSQL using this command. Replace username with your PostgreSQL username:
   ```
   psql -U username
   ```
3. Create a PostgreSQL database for the application. Replace your-database-name with your desired database name:
   ```
   CREATE DATABASE your-database-name
   ```

### Installation
1. Install project dependencies using npm (Node Package Manager):
    ```
    npm install
    ```
2. Configure environment variables by creating a `.env` file based on the provided `.env.example` template.
3. Run database migrations to set up the database schema:
   ```
   npm run migrate up
   ```

### Scripts
The following scripts are available in this project:

- `start-prod`: Start the server in production mode using Node.js.
- `start-dev`: Start the server in development mode using nodemon for automatic server restarts.

To use these scripts, run `npm run <script-name>`.

<div align="center">
   
## Presented By :

<img src="https://i.ibb.co/r77z1sz/UNRAM-LOGO-FIX-STATUTA.png" height="150" alt="unram-logo-white" border="0">  |   <img src="https://i.ibb.co/KWmvWjd/download.png" height="150" alt="grand-madani-logo" border="0"> | <img src="https://i.ibb.co/LNPjwvd/kedaireka-ok.png" height="150" alt="kedaireka-logo" border="0">
-----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|-----------------------------
 </div>
