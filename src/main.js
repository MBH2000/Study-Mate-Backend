const express = require('express')
require('../src/DB/DB')
const user_router = require('../src/routers/user-router')
const post_router = require('../src/routers/post')
const item_router = require('../src/routers/product')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(user_router)
app.use(post_router)
app.use(item_router)

app.listen(port, ()=> {
    console.log('server is up on port ' + port )
})


