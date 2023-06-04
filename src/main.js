const express = require('express')
require('../src/DB/DB')
const user_router = require('../src/routers/user-router')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3005
app.use(cors())
app.use(express.json())
app.use(user_router)

//app.use(post_router)
//app.use(item_router)

app.listen(port, ()=> {
    console.log('server is up on port ' + port )
})


