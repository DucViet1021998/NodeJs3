const express = require('express')
const app = express()
const port = 3000
const users = require('./users')

app.use(express.json())

app.use('/', users)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})