// Import required modules
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
require("colors").enable()
require("dotenv").config()
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")

// Import routes
const driverRoutes = require("./routes/driver")
const ownerRoutes = require("./routes/owner")

// Create the Express app
const app = express()

// Middleware
app.use(express.json())
app.use(cors("*"))
app.use(morgan("combined"))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Middleware function for user authentication and authorization
function authorizeUser(req, res, next) {
  if (req.url == "/owner/login") {
    next()
  } else {
    const token = req.headers["token"]
    if (!token) {
      res.status(401).json({ message: "Invalid token" })
    } else {
      try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.id = data.id
        next()
      } catch (error) {
        res.status(401).json({ message: "Invalid token" })
      }
    }
  }
}

app.use(authorizeUser)

// Routes
app.use("/drivers", driverRoutes)
app.use("/owner", ownerRoutes)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.bgBlue)
})

module.exports = app
