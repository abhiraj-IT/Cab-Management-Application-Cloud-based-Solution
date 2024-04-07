const { Sequelize, DataTypes } = require("sequelize")

// Import table structure from models
const cabModel = require("../models/cab")

// Get credentials
const DATABASE = process.env.DATABASE
const USERNAME = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const HOST = process.env.DB_HOST || "localhost"
const DB_PORT = process.env.DB_PORT || 3306

// Create an instance of a sequlize to access the database
const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  port: DB_PORT,
  dialect: "mysql",
})

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.".green)
  })
  .catch((error) => {
    console.error("Unable to connect to the database:".red, error)
  })

const Cab = cabModel(sequelize, DataTypes)

// Create the tables in the database (if they don't exist)
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronized".green)
  })
  .catch((error) => {
    console.error("Error synchronizing database:".red, error)
  })

module.exports = {
  Cab: Cab,
}
