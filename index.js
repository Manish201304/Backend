
const connectToMongo = require('./db'); // Assuming db.js is where you define connectToMongo()
const express = require('express')

connectToMongo();

const app = express()
const port = 3000

app.use(express.json())
// Available routes
app.use('/api/auth', require('./Routes/auth'))
app.use('/api/notes', require('./Routes/notes'))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
