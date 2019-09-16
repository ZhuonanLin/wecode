const express = require('express')
const cors = require('cors')

const app = express()
const port = 3001

app.use(cors());

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

app.get('/check', (req, res) => {
  res.send(`Server is connected on port ${port}.`)
})
