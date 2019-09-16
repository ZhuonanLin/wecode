const express = require('express')
const cors = require('cors')

const app = express()
const port = 3001

app.use(cors());

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

app.get('/', (req, res) => {
  setTimeout(() => {
    res.send('Hello World from server!')
  }, 1000)
})
