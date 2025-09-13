const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const PORT = 3000

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);

})