const express = require('express')
require('../src/DB/DB')
const user_router = require('../src/routers/user-router')
const course_router =require('../src/routers/courses-router')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3005
app.use(cors())
app.use(express.json())
app.use(user_router)
app.use(course_router)
app.listen(port, ()=> {
    console.log('server is up on port ' + port )
})


